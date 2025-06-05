import { SharkUid } from "./SharkUid.mjs";
import { Vec2 } from "./Vec2.mjs";

export class NodeEditToolCreate {
    constructor(page) {
        this.page = page;
    }

    /**
     * 
     * @param {PointerEvent} event 
     */
    pointerDown(event) {
        // 创建节点
        const node = {
            id: SharkUid.create(),
            parentId: this.page.root.id,
        };
        this.page.nodes.push(node);

        // 计算位置
        let transformX;
        let transformY;
        if (this.page.gridSnap) {
            const gridWidth = this.page.gridSize.x;
            const gridHeight = this.page.gridSize.y;
            transformX = Math.floor(event.offsetX / gridWidth) * gridWidth;
            transformY = Math.floor(event.offsetY / gridHeight) * gridHeight;
        } else {
            transformX = event.offsetX;
            transformY = event.offsetY;
        }

        const transform = {
            id: SharkUid.create(),
            nodeId: node.id,
            position: new Vec2(transformX, transformY)
        };
        this.page.components.push(transform);

        // 插入节点树项
        const nodeTreeElement = document.createElement("li");
        nodeTreeElement.textContent = "node";

        this.page.nodeTree.appendChild(nodeTreeElement);

        // 插入游戏元素
        const nodeElement = document.createElement("div");
        nodeElement.style.position = "absolute";
        nodeElement.style.left = `${transformX}px`;
        nodeElement.style.top = `${transformY}px`;

        nodeElement.style.width = "32px";
        nodeElement.style.height = "32px";
        nodeElement.style.backgroundImage = "url(\"block.png\")";

        this.page.nodeContainer.appendChild(nodeElement);
    }
}