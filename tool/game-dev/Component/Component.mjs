import { PropertyTool } from "../Property/PropertyTool.mjs";
import { SharkUid } from "../SharkUid.mjs";
import { getComponent } from "../main.mjs";

export class Component {
    constructor(id, type, prefab, properties) {
        this.id = id;
        this.type = type;
        this.prefab = prefab;
        this.properties = properties;
    }

    static fromData(data) {
        const properties = new Map();
        for (const property of data.properties) {
            properties.set(property.key, PropertyTool.fromData(property.value));
        }

        return new Component(
            data.id,
            data.type,
            getComponent(data.prefab),
            properties
        );
    }

    instantiate() {
        const properties = new Map();
        for (const [key, value] of this.properties) {
            properties.set(key, value.instantiate());
        }

        return new Component(
            SharkUid.create(),
            this.type,
            this,
            properties
        );
    }

    getProperty(key) {
        let result;

        if (this.prefab === undefined || this.properties.get(key).modified) {
            result = this.properties.get(key).value;
        } else {
            result = this.prefab.getProperty(key);
        }

        return result;
    }

    setProperty(key, value) {
        this.properties.get(key).setValue(value);
    }
}