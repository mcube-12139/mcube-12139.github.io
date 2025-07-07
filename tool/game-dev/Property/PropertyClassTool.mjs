export class PropertyClassTool {
    static getSharedValue(values) {
        let same = true;
        let start = true;
        let sharedValue = undefined;

        for (const value of values) {
            if (start) {
                start = false;
                sharedValue = value;
            } else if (sharedValue !== value) {
                same = false;
                break;
            }
        }

        return {
            same: same,
            value: sharedValue
        };
    }
}