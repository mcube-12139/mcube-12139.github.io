import { PropertyType } from "./PropertyType.mjs";

export class NumberProperty {
    constructor(modified, value) {
        this.modified = modified;
        this.value = value;
    }

    getType() {
        return PropertyType.NUMBER;
    }

    instantiate() {
        return new NumberProperty(false, this.value);
    }

    setValue(value) {
        this.modified = true;
        this.value = value;
    }
}