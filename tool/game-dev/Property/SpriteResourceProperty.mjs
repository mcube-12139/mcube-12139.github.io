import { PropertyType } from "./PropertyType.mjs";

export class SpriteResourceProperty {
    constructor(modified, value) {
        this.modified = modified;
        this.value = value;
    }
    
    getType() {
        return PropertyType.SPRITE_RESOURCE;
    }

    instantiate() {
        return new SpriteResourceProperty(false, this.value);
    }

    setValue(value) {
        this.modified = true;
        this.value = value;
    }
}