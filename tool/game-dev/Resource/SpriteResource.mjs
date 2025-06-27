import { ResourceTool } from "./ResourceTool.mjs";
import { ResourceType } from "./ResourceType.mjs";

export class SpriteResource {
    constructor(id, name, source, treeItem) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.treeItem = treeItem;
    }

    getType() {
        return ResourceType.SPRITE;
    }
    
    getTreeItem() {
        if (this.treeItem === undefined) {
            this.treeItem = ResourceTool.createTreeItem(this, this.source, this.name, []);
        }

        return this.treeItem;
    }
}