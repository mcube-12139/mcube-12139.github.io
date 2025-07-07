import { MathTool } from "./MathTool.mjs";

export class Matrix3x3 {
    constructor(n00, n10, n01, n11, n02, n12) {
        this.n00 = n00;
        this.n10 = n10;
        this.n01 = n01;
        this.n11 = n11;
        this.n02 = n02;
        this.n12 = n12;
    }

    static fromTransform(transform) {
        const position = transform.getProperty("position");
        const scale = transform.getProperty("scale");
        const rotation = transform.getProperty("rotation");

        const cosRotation = MathTool.dcos(rotation);
        const sinRotation = MathTool.dsin(rotation);

        return new Matrix3x3(scale.x * cosRotation, scale.x * sinRotation, -scale.y * sinRotation, scale.y * cosRotation, position.x, position.y);
    }

    multiplyVec2(vec2, outVec2) {
        const outX = vec2.x * this.n00 + vec2.y * this.n01 + this.n02;
        const outY = vec2.x * this.n10 + vec2.y * this.n11 + this.n12;
        outVec2.set(outX, outY);
    }
}