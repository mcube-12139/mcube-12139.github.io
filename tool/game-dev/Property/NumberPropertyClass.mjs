import { PropertyType } from "./PropertyType.mjs";
import { NumberProperty } from "./NumberProperty.mjs";
import { ComponentClass } from "../Component/ComponentClass.mjs";
import { PropertyClassTool } from "./PropertyClassTool.mjs";

export class NumberPropertyClass {
    constructor(name) {
        this.name = name;
    }

    getType() {
        return PropertyType.NUMBER;
    }

    instanceFromData(data) {
        return new NumberProperty(data.modified, data.value);
    }

    createEditorElement(components, index, nodeItems) {
        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.className = "shortInput";

        let { same, value } = PropertyClassTool.getSharedValue(components.map(component => component.getProperty(index)));

        inputElement.value = same ? value.toString() : "...";
        inputElement.addEventListener("change", e => {
            const newValue = parseFloat(inputElement.value);
            if (!isNaN(newValue) && newValue !== value) {
                value = newValue;

                if (components[0].clazz.id === ComponentClass.TRANSFORM) {
                    // Transform 后门
                    if (index === ComponentClass.TRANSFORM_ROTATION) {
                        for (const item of nodeItems) {
                            item.setRotation(newValue);
                        }
                    }
                }
            }
        });

        return inputElement;
    }
}