import { PropertyType } from "./PropertyType.mjs";

export class Vec2Property {
    constructor(modified, value) {
        this.modified = modified;
        this.value = value;
    }
    
    getType() {
        return PropertyType.VEC2;
    }

    instantiate() {
        return new Vec2Property(false, this.value.clone());
    }

    setValue(value) {
        this.modified = true;
        this.value.setOther(value);
    }
}