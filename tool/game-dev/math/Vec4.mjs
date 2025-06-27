export class Vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static fromData(data) {
        return new Vec4(data.x, data.y, data.z, data.w);
    }

    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}