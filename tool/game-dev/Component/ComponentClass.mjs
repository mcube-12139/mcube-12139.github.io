import { NumberPropertyClass } from "../Property/NumberPropertyClass.mjs";
import { PropertyType } from "../Property/PropertyType.mjs";
import { SpriteResourcePropertyClass } from "../Property/SpriteResourcePropertyClass.mjs";
import { Vec2PropertyClass } from "../Property/Vec2PropertyClass.mjs";

export class ComponentClass {
    // 保留 id
    static TRANSFORM = 0;
    static SPRITE = 1;

    // 保留属性 index
    static TRANSFORM_POSITION = 0;
    static TRANSFORM_SCALE = 1;
    static TRANSFORM_ROTATION = 2;

    static SPRITE_RESOURCE = 0;
    static SPRITE_ORIGIN = 1;

    constructor(id, name, properties) {
        this.id = id;
        this.name = name;
        this.properties = properties;
    }

    static fromData(data) {
        const properties = [];

        for (const propertyData of data.properties) {
            if (propertyData.type === PropertyType.NUMBER) {
                properties.push(new NumberPropertyClass(propertyData.name));
            } else if (propertyData.type === PropertyType.SPRITE_RESOURCE) {
                properties.push(new SpriteResourcePropertyClass(propertyData.name));
            } else if (propertyData.type === PropertyType.VEC2) {
                properties.push(new Vec2PropertyClass(propertyData.name, propertyData.xname, propertyData.yname));
            } else {
                throw new Error(`unknown type: ${propertyData.type}`);
            }
        }

        return new ComponentClass(data.id, data.name, properties);
    }
}