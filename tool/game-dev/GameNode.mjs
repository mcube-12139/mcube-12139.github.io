import { Component } from "./Component/Component.mjs";
import { ComponentType } from "./Component/ComponentType.mjs";
import { getResource } from "./main.mjs";
import { Vec4 } from "./math/Vec4.mjs";
import { SharkUid } from "./SharkUid.mjs";
import { TreeItem } from "./TreeItem.mjs";

export class GameNode {
    constructor(id, parent, children, components,contentRect, element, treeItem) {
        this.id = id;
        this.parent = parent;
        this.children = children;
        this.components = components;
        this.contentRect = contentRect;

        this.element = element;
        this.treeItem = treeItem;
    }

    static getImage(componentsData) {
        let result = "image/unknown.png";

        for (const componentData of componentsData) {
            if (componentData.type === ComponentType.SPRITE) {
                for (const property of componentData.properties) {
                    if (property.key === "resource") {
                        result = getResource(property.value.value).data.source;
                        break;
                    }
                }
            }
        }

        return result;
    }

    static fromData(data) {
        const children = [];
        for (const childData of data.children) {
            const child = this.fromData(childData);
            children.push(child);
        }

        const components = [];
        for (const componentData of data.components) {
            components.push(Component.fromData(componentData));
        }

        // 节点树项元素
        const treeItem = new TreeItem(undefined, "node", undefined);

        // 游戏元素
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.transformOrigin = `${-data.contentRect.x}px ${-data.contentRect.y}px`;

        element.style.width = `${data.contentRect.width}px`;
        element.style.height = `${data.contentRect.height}px`;
        element.style.backgroundImage = `url("${this.getImage(data.components)}")`;

        return new GameNode(
            SharkUid.create(),
            undefined,
            children,
            components,
            Vec4.fromData(data.contentRect),
            element,
            treeItem
        );
    }

    setPosition(position) {
        for (const component of components) {
            if (component.type === ComponentType.TRANSFORM) {
                component.setProperty("position", position);
                break;
            }
        }
    }
}