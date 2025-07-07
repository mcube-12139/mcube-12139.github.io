export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static fromData(data) {
        return new Vec2(data.x, data.y);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    setOther(vec) {
        this.x = vec.x;
        this.y = vec.y;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
}