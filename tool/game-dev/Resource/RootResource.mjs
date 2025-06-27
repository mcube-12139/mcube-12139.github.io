import { ResourceTool } from "./ResourceTool.mjs";
import { ResourceType } from "./ResourceType.mjs";

export class RootResource {
    constructor(id, children, treeItem) {
        this.id = id;
        this.children = children;
        this.treeItem = treeItem;
    }

    get name() {
        return "root";
    }

    getType() {
        return ResourceType.ROOT;
    }

    getTreeItem() {
        if (this.treeItem === undefined) {
            this.treeItem = ResourceTool.createTreeItem(this, undefined, "root", this.children);
        }

        return this.treeItem;
    }

    appendChild(resource) {
        this.children.push(resource);
        this.treeItem?.appendChild(resource.getTreeItem());
    }
}