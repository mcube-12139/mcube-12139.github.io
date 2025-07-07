import { ComponentClass } from "../Component/ComponentClass.mjs";
import { Vec4 } from "./Vec4.mjs";

export class MathTool {
    static dcos(angle) {
        if (angle === 0) {
            return 1;
        }

        if (angle === 180) {
            return -1;
        }

        if (angle === 90 || angle === 270) {
            return 0;
        }

        return Math.cos(angle * Math.PI / 180);
    }

    static dsin(angle) {
        if (angle === 0 || angle === 180) {
            return 0;
        }

        if (angle === 90) {
            return 1;
        }

        if (angle === 270) {
            return -1;
        }

        return Math.sin(angle * Math.PI / 180);
    }

    static transformRect(transform, rect) {
        const position = transform.getProperty(ComponentClass.TRANSFORM_POSITION);
        const rotation = transform.getProperty(ComponentClass.TRANSFORM_ROTATION);
        const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);

        return new Vec4(rect.x + position.x, rect.y + position.y, rect.z, rect.w);
    }
}