import { idManager } from "../main.mjs";

export class Component {
    constructor(id, clazz, prefab, properties) {
        this.id = id;
        this.clazz = clazz;
        this.prefab = prefab;
        this.properties = properties;
    }

    static fromData(data) {
        return new Component(
            data.id,
            undefined,
            undefined,
            undefined
        );
    }

    instantiate() {
        return new Component(
            idManager.nextComponentId(),
            this.clazz,
            this,
            this.properties.map(property => property.instantiate())
        );
    }

    getProperty(index) {
        return this.properties[index].value;
    }

    setProperty(index, value) {
        this.properties[index].setValue(value);
    }
}