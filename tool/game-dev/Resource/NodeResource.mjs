import { GameNode } from "../GameNode.mjs";
import { setSelectedResource } from "../main.mjs";
import { Vec2 } from "../math/Vec2.mjs";
import { TreeItem } from "../TreeItem.mjs";
import { ResourceType } from "./ResourceType.mjs";

export class NodeResource {
    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {GameNode | undefined} node 
     * @param {Vec2} editOrigin 
     */
    constructor(id, name, node, editOrigin) {
        this.id = id;
        this.name = name;
        this.node = node;
        this.editOrigin = editOrigin;
        
        this.treeItem = new TreeItem(undefined, name, undefined);
        this.treeItem.element.addEventListener("pointerdown", e => {
            setSelectedResource(this);
            e.stopPropagation();
        });
    }

    getType() {
        return ResourceType.NODE;
    }
}