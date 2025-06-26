import { setSelectedResource } from "../main.mjs";
import { TreeItem } from "../TreeItem.mjs";
import { ResourceType } from "./ResourceType.mjs";

export class SpriteResource {
    constructor(id, name, source) {
        this.id = id;
        this.name = name;
        this.source = source;

        this.treeItem = new TreeItem(source, name, undefined);
        this.treeItem.element.addEventListener("pointerdown", e => {
            setSelectedResource(this);
            e.stopPropagation();
        });
    }

    getType() {
        return ResourceType.SPRITE;
    }
}