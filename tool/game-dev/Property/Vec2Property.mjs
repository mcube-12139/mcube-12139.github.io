export class Vec2Property {
    constructor(modified, value) {
        this.modified = modified;
        this.value = value;
    }

    instantiate() {
        return new Vec2Property(false, this.value);
    }

    setValue(value) {
        this.modified = true;
        this.value.set(value);
    }
}