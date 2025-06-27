import { Component } from "./Component/Component.mjs";
import { ComponentType } from "./Component/ComponentType.mjs";
import { nextNodeId } from "./main.mjs";
import { MathTool } from "./math/MathTool.mjs";
import { Vec4 } from "./math/Vec4.mjs";
import { NodeItem } from "./NodeItem.mjs";
import { TreeItem } from "./TreeItem.mjs";

export class GameNode {
    /**
     * 
     * @param {number} id 
     * @param {GameNode | undefined} prefab 
     * @param {string} name 
     * @param {GameNode | undefined} parent 
     * @param {GameNode[]} children 
     * @param {Component[]} components 
     * @param {Vec4} contentRect 
     */
    constructor(id, prefab, name, parent, children, components, contentRect) {
        this.id = id;
        this.prefab = prefab;
        this.name = name;
        this.parent = parent;
        this.children = children;
        this.components = components;
        this.contentRect = contentRect;

        this.transform = undefined;
        this.sprite = undefined;
    }

    static fromData(data) {
        return new GameNode(
            data.id,
            undefined,
            data.name,
            undefined,
            [],
            [],
            Vec4.fromData(data.contentRect)
        );
    }

    instantiate() {
        const children = [];
        for (const child of this.children) {
            children.push(child.instantiate());
        }

        const components = [];
        for (const component of this.components) {
            components.push(component.instantiate());
        }

        return new GameNode(
            nextNodeId(),
            this,
            this.name,
            undefined,
            children,
            components,
            this.contentRect.clone()
        );
    }

    getComponent(type) {
        let result = undefined;

        for (const component of this.components) {
            if (component.type === type) {
                result = component;
                break;
            }
        }

        return result;
    }

    getTransform() {
        if (this.transform === undefined) {
            this.transform = this.getComponent(ComponentType.TRANSFORM);
        }

        return this.transform;
    }

    getSprite() {
        if (this.sprite === undefined) {
            this.sprite = this.getComponent(ComponentType.SPRITE);
        }

        return this.sprite;
    }

    getImage() {
        const resource = this.getSprite()?.getProperty("resource");

        return resource?.source;
    }

    createElement() {
        // 创建元素
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.transformOrigin = `${-this.contentRect.x}px ${-this.contentRect.y}px`;

        const transform = this.getTransform();
        if (transform !== undefined) {
            const position = transform.getProperty("position");
            const scale = transform.getProperty("scale");

            element.style.transform = `scale(${scale.x}, ${scale.y}) rotate(${transform.getProperty("rotation")}deg) translate(${position.x}px, ${position.y}px)`;
        }
        
        element.style.width = `${this.contentRect.z}px`;
        element.style.height = `${this.contentRect.w}px`;

        for (const child of this.children) {
            element.appendChild(child.createElement());
        }

        return element;
    }

    createTreeItem() {
        // 创建节点树元素
        const treeItemChildren = [];
        for (const child of this.children) {
            treeItemChildren.push(child.createTreeItem());
        }

        const treeItem = new TreeItem(this.getImage(), this.name, treeItemChildren);

        return treeItem;
    }

    createNodeItem() {
        return new NodeItem(this, this.createElement(), this.createTreeItem());
    }

    appendChild(node) {
        node.parent = this;
        this.children.push(node);
    }

    addComponent(component) {
        this.components.push(component);
    }

    setPosition(position) {
        const transform = this.getTransform();
        if (transform !== undefined) {
            transform.setProperty("position", position);
        }
    }

    getContentRect() {
        let result;

        const transform = this.getTransform();
        if (transform !== undefined) {
            result = MathTool.transformRect(transform, this.contentRect);
        } else {
            result = this.contentRect;
        }

        return result;
    }
}