import { NodeEditToolCreate } from "./NodeEditToolCreate.mjs";
import { NodeEditToolDelete } from "./NodeEditToolDelete.mjs";
import { NodeEditToolSelect } from "./NodeEditToolSelect.mjs";
import { NodeEditToolSelectRegion } from "./NodeEditToolSelectRegion.mjs";
import { NodeTreeItem } from "./NodeTreeItem.mjs";
import { SharkUid } from "./SharkUid.mjs";
import { Vec2 } from "./math/Vec2.mjs";

const pageElement = document.querySelector("#page");
const nodeTree = document.querySelector("#nodeTree");
const nodeEditToolCreate = document.querySelector("#nodeEditToolCreate");
const nodeEditToolDelete = document.querySelector("#nodeEditToolDelete");
const nodeEditToolSelect = document.querySelector("#nodeEditToolSelect");
const nodeEditToolSelectRegion = document.querySelector("#nodeEditToolSelectRegion");
const gridVisible = document.querySelector("#gridVisible");
const gridSnap = document.querySelector("#gridSnap");
const gridWidth = document.querySelector("#gridWidth");
const gridHeight = document.querySelector("#gridHeight");
const gridSize32 = document.querySelector("#gridSize32");
const gridSize16 = document.querySelector("#gridSize16");
const gridSize8 = document.querySelector("#gridSize8");
const gridSize4 = document.querySelector("#gridSize4");
const scene = document.querySelector("#scene");
const nodeContainer = document.querySelector("#nodeContainer");
const nodeShadow = document.querySelector("#nodeShadow");
const grid = document.querySelector("#grid");
const interactor = document.querySelector("#interactor");

const rootElement = document.createElement("div");
nodeContainer.appendChild(rootElement);

const root = {
    id: "b6e1140f89b67245fb03f25c1d4132a7",
    parent: undefined,
    children: [],
    components: [
        {
            id: "0eebb34ffeec15d19b4661d4c4642a45",
            position: new Vec2(0, 0)
        }
    ],
    element: rootElement,
    treeItem: new NodeTreeItem("root")
};
nodeTree.appendChild(root.treeItem.element);

const page = {
    element: pageElement,
    nodeTree: nodeTree,
    scene: scene,
    gridWidthElement: gridWidth,
    gridHeightElement: gridHeight,
    nodeContainer: nodeContainer,
    nodeShadow: nodeShadow,
    grid: grid,
    interactor: interactor,
    tool: null,
    gridVisible: true,
    gridSnap: true,
    gridSize: new Vec2(32, 32),
    gridColor: "#0000007f",
    overlapEnabled: false,
    penetrateEnabled: false,
    multiselectEnabled: false,
    root: root,
    baseNode: root,
    mousePos: new Vec2(0, 0),

    setGridVisible(visible) {
        this.gridVisible = visible;
        this.grid.style.display = visible ? "block" : "none";
        if (visible) {
            this.redrawGrid(this.scene.getBoundingClientRect());
        }
    },
    setGridSize(width, height) {
        this.gridSize.set(width, height);
        this.gridWidthElement.valueAsNumber = width;
        this.gridHeightElement.valueAsNumber = height;
        if (this.gridVisible) {
            this.redrawGrid(this.scene.getBoundingClientRect());
        }
    },
    redrawGrid(rect) {
        this.grid.width = rect.width;
        this.grid.height = rect.height;
    
        const ctx = this.grid.getContext("2d");
        ctx.fillStyle = "#0000007f";
        for (let i = 0; i < this.grid.width; i += this.gridSize.x) {
            ctx.fillRect(i, 0, 1, this.grid.height);
        }
        for (let i = 0; i < this.grid.height; i += this.gridSize.y) {
            ctx.fillRect(0, i, this.grid.width, 1);
        }
    },
    getSnappedPosition(x, y) {
        let resultX;
        let resultY;

        if (this.gridSnap) {
            const gridWidth = this.gridSize.x;
            const gridHeight = this.gridSize.y;
            resultX = Math.floor(x / gridWidth) * gridWidth;
            resultY = Math.floor(y / gridHeight) * gridHeight;
        } else {
            resultX = x;
            resultY = y;
        }

        this.mousePos.set(resultX, resultY);
    },
    pointerDownCreate(x, y) {
        // 计算位置
        this.getSnappedPosition(x, y);

        // 插入节点树项
        const treeItem = new NodeTreeItem("node");

        this.root.treeItem.appendChild(treeItem);
        this.root.treeItem.setExpanded(true);

        // 插入游戏元素
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.transformOrigin = "16px 16px";
        element.style.transform = `matrix(1, 0, 0, 1, ${this.mousePos.x}, ${this.mousePos.y})`;

        element.style.width = "32px";
        element.style.height = "32px";
        element.style.backgroundImage = "url(\"block.png\")";

        this.nodeContainer.appendChild(element);

        // 创建节点
        const node = {
            id: SharkUid.create(),
            parent: this.root,
            children: [],
            components: [
                {
                    id: SharkUid.create(),
                    position: new Vec2(this.mousePos.x + 16, this.mousePos.y + 16)
                }
            ],
            element: element,
            treeItem: treeItem
        };
        this.root.children.push(node);
    },
    pointerMoveCreate(x, y) {
        this.getSnappedPosition(x, y);
        // 移动影子
        this.nodeShadow.style.transform = `matrix(1, 0, 0, 1, ${this.mousePos.x}, ${this.mousePos.y})`;
    }
};
page.tool = new NodeEditToolCreate(page);

nodeEditToolCreate.addEventListener("change", e => {
    page.tool = new NodeEditToolCreate(page);
});
nodeEditToolDelete.addEventListener("change", e => {
    page.tool = new NodeEditToolDelete(page);
});
nodeEditToolSelect.addEventListener("change", e => {
    page.tool = new NodeEditToolSelect(page);
});
nodeEditToolSelectRegion.addEventListener("change", e => {
    page.tool = new NodeEditToolSelectRegion(page);
});
gridVisible.addEventListener("change", e => {
    page.setGridVisible(gridVisible.checked);
});
gridSnap.addEventListener("change", e => {
    page.gridSnap = gridSnap.checked;
});
gridWidth.addEventListener("change", e => {
    if (gridWidth.valueAsNumber >= 2) {
        page.setGridSize(gridWidth.valueAsNumber, page.gridSize.y);
    } else {
        gridWidth.valueAsNumber = page.gridSize.x;
    }
});
gridHeight.addEventListener("change", e => {
    if (gridHeight.valueAsNumber >= 2) {
        page.setGridSize(page.gridSize.x, gridHeight.valueAsNumber);
    } else {
        gridHeight.valueAsNumber = page.gridSize.y;
    }
});
gridSize32.addEventListener("pointerup", e => {
    page.setGridSize(32, 32);
});
gridSize16.addEventListener("pointerup", e => {
    page.setGridSize(16, 16);
});
gridSize8.addEventListener("pointerup", e => {
    page.setGridSize(8, 8);
});
gridSize4.addEventListener("pointerup", e => {
    page.setGridSize(4, 4);
});

interactor.addEventListener("pointerdown", e => {
    page.tool.pointerDown(e);
});
interactor.addEventListener("pointermove", e => {
    page.tool.pointerMove(e);
});
interactor.addEventListener("contextmenu", e => {
    e.preventDefault();
});

nodeShadow.style.width = "32px";
nodeShadow.style.height = "32px";
nodeShadow.style.backgroundImage = "url(\"block.png\")";
nodeShadow.style.opacity = "0.5";

const sceneObserver = new ResizeObserver(entries => {
    if (page.gridVisible) {
        for (const entry of entries) {
            const rect = entry.contentRect;
            page.redrawGrid(rect);
        }
    }
});
sceneObserver.observe(scene);

globalThis.exportGame = () => {
    console.log(JSON.stringify(page.root, null, 4));
};