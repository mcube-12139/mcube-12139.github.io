import { GameNode } from "../GameNode.mjs";
import { setDraggedResource, setSelectedResource } from "../main.mjs";
import { Vec2 } from "../math/Vec2.mjs";
import { TreeItem } from "../TreeItem.mjs";
import { NodeResource } from "./NodeResource.mjs";
import { ResourceType } from "./ResourceType.mjs";
import { RootResource } from "./RootResource.mjs";
import { SpriteResource } from "./SpriteResource.mjs";

export class ResourceTool {
    static fromData(data) {
        let result;

        if (data.type === ResourceType.ROOT) {
            result = new RootResource(data.id, [], undefined);
        } else if (data.type === ResourceType.SPRITE) {
            result = new SpriteResource(data.id, undefined, data.name, data.source, Vec2.fromData(data.size), undefined);
        } else if (data.type === ResourceType.NODE) {
            result = new NodeResource(data.id, undefined, data.name, undefined, Vec2.fromData(data.editOrigin), undefined);
        } else {
            throw new Error(`unknown resource type: ${data.type}`);
        }

        return result;
    }

    static createTreeItem(resource, iconSrc, name, children) {
        const treeItem = new TreeItem(iconSrc, name, children.map(child => child.getTreeItem()));
        treeItem.element.draggable = true;
        treeItem.element.addEventListener("dragstart", e => {
            e.dataTransfer.effectAllowed = "link";
            setDraggedResource(resource);
            e.stopPropagation();
        });
        treeItem.element.addEventListener("pointerup", e => {
            setSelectedResource(resource);
            e.stopPropagation();
        });

        return treeItem;
    }
}