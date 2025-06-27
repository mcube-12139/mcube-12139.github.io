import { selectNodeItem } from "./main.mjs";

export class NodeItem {
    constructor(node, element, treeItem) {
        this.node = node;
        this.element = element;
        this.treeItem = treeItem;

        treeItem.element.addEventListener("pointerdown", e => {
            selectNodeItem(this);
            e.stopPropagation();
        });
    }

    appendChild(item) {
        // 显示图像
        item.element.style.backgroundImage = `url("${item.node.getImage() ?? "image/unknown.png"}")`;

        this.node.appendChild(item.node);
        this.element.appendChild(item.element);
        this.treeItem.appendChild(item.treeItem);
    }

    setPosition(position) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const scale = transform.getProperty("scale");
            this.element.style.transform = `scale(${scale.x}, ${scale.y}) rotate(${transform.getProperty("rotation")}deg) translate(${position.x}px, ${position.y}px)`;
        }

        this.node.setPosition(position);
    }
}