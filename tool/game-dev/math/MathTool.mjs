import { Vec4 } from "./Vec4.mjs";

export class MathTool {
    static transformRect(transform, rect) {
        const position = transform.getProperty("position");
        const scale = transform.getProperty("scale");
        const rotation = transform.getProperty("rotation");

        return new Vec4(rect.x + position.x, rect.y + position.y, rect.z, rect.w);
    }
}