import { ComponentClass } from "../Component/ComponentClass.mjs";
import { draggedResource } from "../main.mjs";
import { ResourceType } from "../Resource/ResourceType.mjs";
import { PropertyClassTool } from "./PropertyClassTool.mjs";
import { PropertyType } from "./PropertyType.mjs";
import { SpriteResourceProperty } from "./SpriteResourceProperty.mjs";

export class SpriteResourcePropertyClass {
    constructor(name) {
        this.name = name;
    }
    
    getType() {
        return PropertyType.SPRITE_RESOURCE;
    }
    
    instanceFromData(data) {
        return new SpriteResourceProperty(data.modified, undefined);
    }

    createEditorElement(components, index, nodeItems) {
        const element = document.createElement("div");
        element.className = "dropInput horizontalLayout";

        const iconElement = document.createElement("img");
        element.appendChild(iconElement);
        iconElement.className = "icon";

        const nameElement = document.createElement("span");
        element.appendChild(nameElement);

        let { same, value } = PropertyClassTool.getSharedValue(components.map(component => component.getProperty(index)));
        if (same) {
            if (value.source !== "") {
                iconElement.src = value.source;
            } else {
                iconElement.style.display = "none";
            }
            nameElement.textContent = value.name;
        } else {
            iconElement.style.display = "none";
            nameElement.textContent = "...";
        }

        element.addEventListener("dragover", e => {
            if (draggedResource.getType() === ResourceType.SPRITE) {
                e.dataTransfer.dropEffect = "link";
                e.preventDefault();
            }
        });
        element.addEventListener("drop", e => {
            if (draggedResource.getType() === ResourceType.SPRITE) {
                if (draggedResource !== value) {
                    value = draggedResource;

                    // 改变元素
                    if (draggedResource.source !== "") {
                        iconElement.src = draggedResource.source;
                    } else {
                        iconElement.style.display = "none";
                    }
                    nameElement.textContent = draggedResource.name;

                    if (components[0].clazz.id === ComponentClass.SPRITE) {
                        // Sprite 后门
                        if (index === ComponentClass.SPRITE_RESOURCE) {
                            for (const item of nodeItems) {
                                item.setSpriteResource(draggedResource);
                            }
                        }
                    }
                }
            }
        });

        return element;
    }
}