import { GameNode } from "../GameNode.mjs";
import { Vec2 } from "../math/Vec2.mjs";
import { NodeResource } from "./NodeResource.mjs";
import { ResourceType } from "./ResourceType.mjs";
import { RootResource } from "./RootResource.mjs";
import { SpriteResource } from "./SpriteResource.mjs";

export class ResourceTool {
    static fromData(data) {
        let result;

        if (data.type === ResourceType.ROOT) {
            result = new RootResource(data.id, []);
        } else if (data.type === ResourceType.SPRITE) {
            result = new SpriteResource(data.id, data.name, data.source);
        } else if (data.type === ResourceType.NODE) {
            result = new NodeResource(data.id, data.name, undefined, Vec2.fromData(data.editOrigin));
        }

        return result;
    }
}