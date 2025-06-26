import { setSelectedResource } from "../main.mjs";
import { TreeItem } from "../TreeItem.mjs";
import { ResourceType } from "./ResourceType.mjs";

export class RootResource {
    constructor(id, children) {
        this.id = id;
        this.children = children;

        this.treeItem = new TreeItem(undefined, "root", children.map(child => child.treeItem));
        this.treeItem.element.addEventListener("pointerdown", e => {
            setSelectedResource(this);
            e.stopPropagation();
        });
    }

    get name() {
        return "root";
    }

    getType() {
        return ResourceType.ROOT;
    }

    appendChild(resource) {
        this.children.push(resource);
        this.treeItem.appendChild(resource.treeItem);
    }
}