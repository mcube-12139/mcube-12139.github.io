import { GameNode } from "../GameNode.mjs";
import { setSelectedResource } from "../main.mjs";
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
            result = new SpriteResource(data.id, data.name, data.source, undefined);
        } else if (data.type === ResourceType.NODE) {
            result = new NodeResource(data.id, data.name, undefined, Vec2.fromData(data.editOrigin), undefined);
        }

        return result;
    }

    static createTreeItem(resource, iconSrc, name, children) {
        const treeItem = new TreeItem(iconSrc, name, children.map(child => child.getTreeItem()));
        treeItem.element.addEventListener("pointerdown", e => {
            setSelectedResource(resource);
            e.stopPropagation();
        });

        return treeItem;
    }
}