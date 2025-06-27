import { selectedResource } from "../main.mjs";
import { MathTool } from "../math/MathTool.mjs";
import { Vec2 } from "../math/Vec2.mjs";
import { NodeEditToolCreate } from "../NodeEditTool/NodeEditToolCreate.mjs";
import { NodeEditToolDelete } from "../NodeEditTool/NodeEditToolDelete.mjs";
import { NodeEditToolSelect } from "../NodeEditTool/NodeEditToolSelect.mjs";
import { NodeEditToolSelectRegion } from "../NodeEditTool/NodeEditToolSelectRegion.mjs";
import { NodeItem } from "../NodeItem.mjs";
import { ResourceType } from "../Resource/ResourceType.mjs";

export class NodeEditPage {
    constructor(gridVisible, gridSnap, gridWidth, gridHeight, gridColor, root) {
        const element = document.createElement("div");
        element.className = "page";

        // 节点树
        const nodeTreeBlock = document.createElement("div");
        nodeTreeBlock.className = "verticalLayout block";
        element.appendChild(nodeTreeBlock);

        const nodeTreeTitle = document.createElement("div");
        nodeTreeTitle.className = "container";
        nodeTreeTitle.textContent = "节点树";
        nodeTreeBlock.appendChild(nodeTreeTitle);

        const nodeTreeContainer = document.createElement("div");
        nodeTreeContainer.className = "container scrollable";
        nodeTreeBlock.appendChild(nodeTreeContainer);

        const nodeTree = document.createElement("ol");
        nodeTreeContainer.appendChild(nodeTree);

        // 工具栏 & 场景
        const toolbarAndSceneContainer = document.createElement("div");
        toolbarAndSceneContainer.className = "verticalLayout grow";
        element.appendChild(toolbarAndSceneContainer);

        // 工具栏
        const toolbarBlock = document.createElement("div");
        toolbarBlock.className = "verticalLayout container block";
        toolbarAndSceneContainer.appendChild(toolbarBlock);

        // 工具
        const toolLayout = document.createElement("div");
        toolLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(toolLayout);

        const toolTitle = document.createTextNode("工具");
        toolLayout.appendChild(toolTitle);

        const createRadio = document.createElement("input");
        createRadio.type = "radio";
        createRadio.name = "nodeEditTool";
        createRadio.checked = true;
        toolLayout.appendChild(createRadio);

        const createLabel = document.createTextNode("创建");
        toolLayout.appendChild(createLabel);

        const deleteRadio = document.createElement("input");
        deleteRadio.type = "radio";
        deleteRadio.name = "nodeEditTool";
        toolLayout.appendChild(deleteRadio);

        const deleteLabel = document.createTextNode("删除");
        toolLayout.appendChild(deleteLabel);

        const selectRadio = document.createElement("input");
        selectRadio.type = "radio";
        selectRadio.name = "nodeEditTool";
        toolLayout.appendChild(selectRadio);

        const selectLabel = document.createTextNode("选择");
        toolLayout.appendChild(selectLabel);

        const selectRegionRadio = document.createElement("input");
        selectRegionRadio.type = "radio";
        selectRegionRadio.name = "nodeEditTool";
        toolLayout.appendChild(selectRegionRadio);

        const selectRegionLabel = document.createTextNode("框选");
        toolLayout.appendChild(selectRegionLabel);

        // 网格
        const gridLayout = document.createElement("div");
        gridLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(gridLayout);

        const gridTitle = document.createTextNode("网格");
        gridLayout.appendChild(gridTitle);

        const gridVisibleInput = document.createElement("input");
        gridVisibleInput.type = "checkbox";
        gridVisibleInput.checked = true;
        gridLayout.appendChild(gridVisibleInput);

        const gridVisibleLabel = document.createTextNode("显示");
        gridLayout.appendChild(gridVisibleLabel);

        const gridSnapCheck = document.createElement("input");
        gridSnapCheck.type = "checkbox";
        gridSnapCheck.checked = gridSnap;
        gridLayout.appendChild(gridSnapCheck);

        const gridSnapLabel = document.createTextNode("吸附 ");
        gridLayout.appendChild(gridSnapLabel);

        const gridWidthLabel = document.createTextNode("宽度");
        gridLayout.appendChild(gridWidthLabel);

        const gridWidthInput = document.createElement("input");
        gridWidthInput.className = "shortInput";
        gridWidthInput.type = "number";
        gridWidthInput.valueAsNumber = gridWidth;
        gridLayout.appendChild(gridWidthInput);

        const gridHeightLabel = document.createTextNode("高度");
        gridLayout.appendChild(gridHeightLabel);

        const gridHeightInput = document.createElement("input");
        gridHeightInput.className = "shortInput";
        gridHeightInput.type = "number";
        gridHeightInput.valueAsNumber = gridHeight;
        gridLayout.appendChild(gridHeightInput);

        const gridSize32Button = document.createElement("button");
        gridSize32Button.textContent = "32";
        gridLayout.appendChild(gridSize32Button);

        const gridSize16Button = document.createElement("button");
        gridSize16Button.textContent = "16";
        gridLayout.appendChild(gridSize16Button);

        const gridSize8Button = document.createElement("button");
        gridSize8Button.textContent = "8";
        gridLayout.appendChild(gridSize8Button);

        const gridSize4Button = document.createElement("button");
        gridSize4Button.textContent = "4";
        gridLayout.appendChild(gridSize4Button);

        // 选项
        const optionLayout = document.createElement("div");
        optionLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(optionLayout);
        
        const optionTitle = document.createTextNode("选项");
        optionLayout.appendChild(optionTitle);

        const overlapEnabled = document.createElement("input");
        overlapEnabled.type = "checkbox";
        optionLayout.appendChild(overlapEnabled);

        const overlapEnabledLabel = document.createTextNode("重叠");
        optionLayout.appendChild(overlapEnabledLabel);

        const penetrateEnabled = document.createElement("input");
        penetrateEnabled.type = "checkbox";
        optionLayout.appendChild(penetrateEnabled);

        const penetrateEnabledLabel = document.createTextNode("穿透");
        optionLayout.appendChild(penetrateEnabledLabel);

        const multiselectEnabled = document.createElement("input");
        multiselectEnabled.type = "checkbox";
        optionLayout.appendChild(multiselectEnabled);

        const multiselectEnabledLabel = document.createTextNode("多选");
        optionLayout.appendChild(multiselectEnabledLabel);

        // 操作
        const operateLayout = document.createElement("div");
        operateLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(operateLayout);

        const operateTitle = document.createTextNode("操作");
        operateLayout.appendChild(operateTitle);

        const saveButton = document.createElement("button");
        saveButton.textContent = "保存"
        operateLayout.appendChild(saveButton);

        const undoButton = document.createElement("button");
        undoButton.textContent = "撤销"
        operateLayout.appendChild(undoButton);

        const redoButton = document.createElement("button");
        redoButton.textContent = "重做"
        operateLayout.appendChild(redoButton);

        const cutButton = document.createElement("button");
        cutButton.textContent = "剪切"
        operateLayout.appendChild(cutButton);

        const copyButton = document.createElement("button");
        copyButton.textContent = "复制"
        operateLayout.appendChild(copyButton);

        const pasteButton = document.createElement("button");
        pasteButton.textContent = "粘贴"
        operateLayout.appendChild(pasteButton);

        // 场景
        const sceneElement = document.createElement("div");
        sceneElement.className = "scene grow";
        toolbarAndSceneContainer.appendChild(sceneElement);

        const nodeContainerElement = document.createElement("div");
        nodeContainerElement.className = "nodeContainer";
        sceneElement.appendChild(nodeContainerElement);

        const nodeShadowElement = document.createElement("div");
        nodeShadowElement.className = "nodeShadow";
        sceneElement.appendChild(nodeShadowElement);

        const gridCanvas = document.createElement("canvas");
        gridCanvas.className = "gridCanvas";
        sceneElement.appendChild(gridCanvas);

        const interactor = document.createElement("div");
        interactor.className = "interactor";
        sceneElement.appendChild(interactor);

        // 检查器
        const inspectorBlock = document.createElement("div");
        inspectorBlock.className = "verticalLayout block";
        element.appendChild(inspectorBlock);

        const inspectorTitle = document.createElement("div");
        inspectorTitle.className = "container scrollable";
        inspectorTitle.textContent = "检查器";
        inspectorBlock.appendChild(inspectorTitle);
        
        createRadio.addEventListener("change", e => {
            this.tool = new NodeEditToolCreate(this);
        });
        deleteRadio.addEventListener("change", e => {
            this.tool = new NodeEditToolDelete(this);
        });
        selectRadio.addEventListener("change", e => {
            this.tool = new NodeEditToolSelect(this);
        });
        selectRegionRadio.addEventListener("change", e => {
            this.tool = new NodeEditToolSelectRegion(this);
        });
        gridVisibleInput.addEventListener("change", e => {
            this.setGridVisible(gridVisibleInput.checked);
        });
        gridSnapCheck.addEventListener("change", e => {
            this.gridSnap = gridSnapCheck.checked;
        });
        gridWidthInput.addEventListener("change", e => {
            if (gridWidthInput.valueAsNumber >= 2) {
                this.setGridSize(gridWidthInput.valueAsNumber, this.gridSize.y);
            } else {
                gridWidthInput.valueAsNumber = this.gridSize.x;
            }
        });
        gridHeightInput.addEventListener("change", e => {
            if (gridHeightInput.valueAsNumber >= 2) {
                this.setGridSize(this.gridSize.x, gridHeightInput.valueAsNumber);
            } else {
                gridHeightInput.valueAsNumber = this.gridSize.y;
            }
        });
        gridSize32Button.addEventListener("pointerup", e => {
            this.setGridSize(32, 32);
        });
        gridSize16Button.addEventListener("pointerup", e => {
            this.setGridSize(16, 16);
        });
        gridSize8Button.addEventListener("pointerup", e => {
            this.setGridSize(8, 8);
        });
        gridSize4Button.addEventListener("pointerup", e => {
            this.setGridSize(4, 4);
        });

        interactor.addEventListener("pointerdown", e => {
            this.tool.pointerDown(e);
        });
        interactor.addEventListener("pointermove", e => {
            this.tool.pointerMove(e);
        });
        interactor.addEventListener("pointerup", e => {
            this.tool.pointerUp(e);
        });
        interactor.addEventListener("contextmenu", e => {
            e.preventDefault();
        });

        const sceneObserver = new ResizeObserver(entries => {
            if (this.gridVisible) {
                for (const entry of entries) {
                    const rect = entry.contentRect;
                    this.resizeScene(rect);
                }
            }
        });
        sceneObserver.observe(sceneElement);

        const rootItem = root.createNodeItem();
        nodeContainerElement.appendChild(rootItem.element);
        nodeTree.appendChild(rootItem.treeItem.element);
        rootItem.treeItem.setExpanded(true);

        this.element = element;
        this.nodeTree = nodeTree;
        this.scene = sceneElement;
        this.gridWidthElement = gridWidthInput;
        this.gridHeightElement = gridHeightInput;
        this.nodeContainer = nodeContainerElement;
        this.nodeShadow = nodeShadowElement;
        this.grid = gridCanvas;
        this.interactor = interactor;
        this.tool = new NodeEditToolCreate(this);
        this.gridVisible = gridVisible;
        this.gridSnap = gridSnap;
        this.gridSize = new Vec2(gridWidth, gridHeight);
        this.gridColor = gridColor;
        this.overlapEnabled = false;
        this.penetrateEnabled = false;
        this.multiselectEnabled = false;
        this.root = rootItem;
        // 被创建节点的长节点
        this.baseItem = rootItem;
        this.pointerHeld = false;
        this.mousePos = new Vec2(0, 0);
        this.lastMousePos = new Vec2(0, 0);
    }

    changeSelectedResource(resource) {
        if (resource.getType() === ResourceType.NODE) {
            const node = resource.node;

            this.nodeShadow.style.width = `${node.contentRect.z}px`;
            this.nodeShadow.style.height = `${node.contentRect.w}px`;
            this.nodeShadow.style.backgroundImage = `url("${node.getImage()}")`;
        } else {
            this.nodeShadow.style.backgroundImage = "";
        }
    }

    selectNodeItem(item) {
        if (!this.multiselectEnabled) {
            this.baseItem.treeItem.setSelected(false);
            item.treeItem.setSelected(true);

            this.baseItem = item;
        }
    }

    setGridVisible(visible) {
        this.gridVisible = visible;
        this.grid.style.display = visible ? "" : "none";
        if (visible) {
            this.redrawGrid();
        }
    }

    setGridSize(width, height) {
        this.gridSize.set(width, height);
        this.gridWidthElement.valueAsNumber = width;
        this.gridHeightElement.valueAsNumber = height;
        if (this.gridVisible) {
            this.redrawGrid();
        }
    }

    resizeScene(rect) {
        this.grid.width = rect.width;
        this.grid.height = rect.height;
        this.redrawGrid();
    }

    redrawGrid() {
        const ctx = this.grid.getContext("2d");
        ctx.clearRect(0, 0, this.grid.width, this.grid.height);
        ctx.fillStyle = "#0000007f";
        for (let i = 0; i < this.grid.width; i += this.gridSize.x) {
            ctx.fillRect(i, 0, 1, this.grid.height);
        }

        for (let i = 0; i < this.grid.height; i += this.gridSize.y) {
            ctx.fillRect(0, i, this.grid.width, 1);
        }

        // 画坐标值
        ctx.fillStyle = "#000000ff";
        ctx.font = "12px Consolas";
        ctx.textAlign = "left"
        ctx.textBaseline = "top";
        const unitWidth = this.gridSize.x * Math.floor(100 / this.gridSize.x);
        for (let i = 0; i < this.grid.width; i += unitWidth) {
            ctx.fillText(i.toString(), i + 2, 2);
        }

        const unitHeight = this.gridSize.y * Math.floor(100 / this.gridSize.y);
        for (let i = unitHeight; i < this.grid.height; i += unitHeight) {
            ctx.fillText(i.toString(), 2, i + 2);
        }
    }
    
    setMousePos(x, y) {
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
    }

    canCreateNode() {
        let result = true;

        if (selectedResource !== undefined && selectedResource.getType() === ResourceType.NODE) {
            if (!this.overlapEnabled) {
                // 不允许重叠，计算是否有重叠
                const rect = selectedResource.node.getContentRect();
                const createdX = this.mousePos.x + rect.x;
                const createdY = this.mousePos.y + rect.y;

                for (const child of this.baseItem.node.children) {
                    const childRect = child.getContentRect();
                    if (
                        createdX < childRect.x + childRect.z &&
                        createdX + rect.z > childRect.x &&
                        createdY < childRect.y + childRect.w &&
                        createdY + rect.w > childRect.y
                    ) {
                        result = false;
                        break;
                    }
                }
            }
        } else {
            result = false;
        }

        return result;
    }

    createNode() {
        const node = selectedResource.node;

        // 创建节点
        const createdNode = node.instantiate();
        const createdItem = createdNode.createNodeItem();
        this.baseItem.appendChild(createdItem);

        createdItem.setPosition(this.mousePos);
    }

    pointerDownCreate(x, y) {
        this.pointerHeld = true;
        this.setMousePos(x, y);
        this.lastMousePos.setOther(this.mousePos);
        if (this.canCreateNode()) {
            this.createNode();
        }
    }

    pointerMoveCreate(x, y) {
        this.setMousePos(x, y);
        if (!this.mousePos.equals(this.lastMousePos)) {
            // 指针移动了，更新位置
            this.lastMousePos.setOther(this.mousePos);
            if (this.canCreateNode()) {
                // 如果该位置能创建节点
                if (this.pointerHeld && this.gridSnap) {
                    // 指针按着，可能需要创建节点
                    this.createNode();
                }
                // 移动影子
                this.nodeShadow.style.display = "";
                this.nodeShadow.style.transform = `matrix(1, 0, 0, 1, ${this.mousePos.x}, ${this.mousePos.y})`;
            } else {
                this.nodeShadow.style.display = "none";
            }
        }
    }

    pointerUpCreate(x, y) {
        this.pointerHeld = false;
    }
}