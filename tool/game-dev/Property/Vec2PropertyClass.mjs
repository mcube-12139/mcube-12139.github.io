import { ComponentClass } from "../Component/ComponentClass.mjs";
import { Vec2 } from "../math/Vec2.mjs";
import { PropertyClassTool } from "./PropertyClassTool.mjs";
import { PropertyType } from "./PropertyType.mjs";
import { Vec2Property } from "./Vec2Property.mjs";

export class Vec2PropertyClass {
    constructor(name, xname, yname) {
        this.name = name;
        this.xname = xname;
        this.yname = yname;
    }
    
    getType() {
        return PropertyType.VEC2;
    }
    
    instanceFromData(data) {
        return new Vec2Property(data.modified, Vec2.fromData(data.value));
    }

    createEditorElement(components, index, nodeItems) {
        const element = document.createElement("div");

        const xlabel = document.createTextNode(this.xname);
        element.appendChild(xlabel);

        const xinput = document.createElement("input");
        element.appendChild(xinput);
        xinput.type = "text";
        xinput.className = "shortInput";

        const ylabel = document.createTextNode(this.yname);
        element.appendChild(ylabel);

        const yinput = document.createElement("input");
        element.appendChild(yinput);
        yinput.type = "text";
        yinput.className = "shortInput";

        let { same: xsame, value: xvalue } = PropertyClassTool.getSharedValue(components.map(component => component.getProperty(index).x));
        xinput.value = xsame ? xvalue.toString() : "...";
        xinput.addEventListener("change", e => {
            const newValue = parseFloat(xinput.value);
            if (!isNaN(newValue) && newValue !== xvalue) {
                xvalue = newValue;

                const classId = components[0].clazz.id;
                if (classId === ComponentClass.TRANSFORM) {
                    // Transform 后门
                    if (index === ComponentClass.TRANSFORM_POSITION) {
                        for (const item of nodeItems) {
                            item.setPositionX(newValue);
                        }
                    } else if (index === ComponentClass.TRANSFORM_SCALE) {
                        for (const item of nodeItems) {
                            item.setScaleX(newValue);
                        }
                    }
                } else if (classId === ComponentClass.SPRITE) {
                    // Sprite 后门
                    if (index === ComponentClass.SPRITE_ORIGIN) {
                        for (const item of nodeItems) {
                            item.setSpriteOriginX(newValue);
                        }
                    }
                }
            }
        });

        let { same: ysame, value: yvalue } = PropertyClassTool.getSharedValue(components.map(component => component.getProperty(index).y));
        yinput.value = ysame ? yvalue.toString() : "...";
        yinput.addEventListener("change", e => {
            const newValue = parseFloat(yinput.value);
            if (!isNaN(newValue) && newValue !== yvalue) {
                yvalue = newValue;

                const classId = components[0].clazz.id;
                if (classId === ComponentClass.TRANSFORM) {
                    // Transform 后门
                    if (index === ComponentClass.TRANSFORM_POSITION) {
                        for (const item of nodeItems) {
                            item.setPositionY(newValue);
                        }
                    } else if (index === ComponentClass.TRANSFORM_SCALE) {
                        for (const item of nodeItems) {
                            item.setScaleY(newValue);
                        }
                    }
                } else if (classId === ComponentClass.SPRITE) {
                    // Sprite 后门
                    if (index === ComponentClass.SPRITE_ORIGIN) {
                        for (const item of nodeItems) {
                            item.setSpriteOriginY(newValue);
                        }
                    }
                }
            }
        });

        return element;
    }
}