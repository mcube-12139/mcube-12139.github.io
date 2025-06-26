export class SpriteResourceProperty {
    constructor(modified, value) {
        this.modified = modified;
        this.value = value;
    }

    instantiate() {
        return new NumberProperty(false, this.value);
    }

    setValue(value) {
        this.modified = true;
        this.value = value;
    }
}