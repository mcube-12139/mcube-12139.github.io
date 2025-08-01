import { GameNode } from "../GameNode.mjs";
import { Vec2 } from "../math/Vec2.mjs";
import { TreeItem } from "../TreeItem.mjs";
import { ResourceTool } from "./ResourceTool.mjs";
import { ResourceType } from "./ResourceType.mjs";

export class NodeResource {
    /**
     * 
     * @param {number} id 
     * @param {object} parent
     * @param {string} name 
     * @param {GameNode | undefined} node 
     * @param {Vec2} editOrigin 
     * @param {TreeItem} treeItem
     */
    constructor(id, parent, name, node, editOrigin, treeItem) {
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.node = node;
        this.editOrigin = editOrigin;
        this.treeItem = treeItem;
    }

    getType() {
        return ResourceType.NODE;
    }

    getTreeItem() {
        if (this.treeItem === undefined) {
            this.treeItem = ResourceTool.createTreeItem(this, this.node.getImage(), this.name, []);
        }

        return this.treeItem;
    }
}