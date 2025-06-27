import { Vec2 } from "../math/Vec2.mjs";
import { NumberProperty } from "./NumberProperty.mjs";
import { PropertyType } from "./PropertyType.mjs";
import { SpriteResourceProperty } from "./SpriteResourceProperty.mjs";
import { Vec2Property } from "./Vec2Property.mjs";

export class PropertyTool {
    static fromData(data) {
        let result;

        if (data.type === PropertyType.VEC2) {
            result = new Vec2Property(data.modified, Vec2.fromData(data.value));
        } else if (data.type === PropertyType.NUMBER) {
            result = new NumberProperty(data.modified, data.value);
        } else if (data.type === PropertyType.SPRITE_RESOURCE) {
            result = new SpriteResourceProperty(data.modified, undefined);
        }

        return result;
    }
}