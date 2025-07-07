import { ComponentClass } from "./Component/ComponentClass.mjs";
import { selectNodeItem } from "./main.mjs";
import { Vec2 } from "./math/Vec2.mjs";

export class NodeItem {
    constructor(node, element, treeItem) {
        this.node = node;
        this.element = element;
        this.treeItem = treeItem;

        treeItem.element.addEventListener("pointerup", e => {
            selectNodeItem(this);
            e.stopPropagation();
        });
    }

    /**
     * 创建一群节点元件的检查器元素
     * @param {NodeItem[]} items 
     */
    static createInspectors(items) {
        const result = [];

        // 计算所有节点都有的组件类型
        // 该类组件在一个节点上的出现次数
        const classCount = new Map();
        // 节点群里的所有该[组件类, 序号]组件
        const classComponents = new Map();
        let start = true;

        for (const item of items) {
            const node = item.node;

            if (start) {
                start = false;
                for (const component of node.components) {
                    const classId = component.clazz.id;

                    let count = classCount.get(classId);
                    if (count === undefined) {
                        count = 0;
                    }

                    classComponents.set([classId, count], [component]);
                    classCount.set(classId, count + 1);
                }
            } else {
                classCount.clear();
                for (const component of node.components) {
                    const classId = component.clazz.id;

                    let count = classCount.get(classId);
                    if (count === undefined) {
                        count = 0;
                    }

                    const componentsOfClass = classComponents.get([classId, count]);
                    if (componentsOfClass !== undefined) {
                        componentsOfClass.push(component);
                    }
                }
            }
        }

        for (const [[classId, index], components] of classComponents.entries()) {
            if (components.length === items.length) {
                // 所有节点都有
                const clazz = components[0].clazz;

                const element = document.createElement("div");
                element.className = "verticalLayout componentInspector";

                const nameElement = document.createElement("div");
                element.appendChild(nameElement);
                nameElement.className = "componentInspectorName container";
                nameElement.textContent = clazz.name;

                const editorsElement = document.createElement("div");
                editorsElement.className = "propertyGrid container";
                element.appendChild(editorsElement);
                // 创建属性编辑器元素
                for (const [i, propertyClass] of clazz.properties.entries()) {
                    const propertyNameElement = document.createElement("span");
                    editorsElement.appendChild(propertyNameElement);
                    propertyNameElement.textContent = propertyClass.name;

                    const editorElement = propertyClass.createEditorElement(components, i, items);
                    editorsElement.appendChild(editorElement);
                }

                result.push(element);
            }
        }

        return result;
    }

    appendChild(item) {
        // 显示图像
        item.element.style.backgroundImage = `url("${item.node.getImage() ?? "image/unknown.png"}")`;

        this.node.appendChild(item.node);
        this.element.appendChild(item.element);
        this.treeItem.appendChild(item.treeItem);
    }

    setPosition(position) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);
            this.element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${transform.getProperty(ComponentClass.TRANSFORM_ROTATION)}deg) scale(${scale.x}, ${scale.y})`;
        
            transform.setProperty(ComponentClass.TRANSFORM_POSITION, position);
        }
    }

    setPositionX(x) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const position = transform.getProperty(ComponentClass.TRANSFORM_POSITION);
            const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);
            this.element.style.transform = `translate(${x}px, ${position.y}px) rotate(${transform.getProperty(ComponentClass.TRANSFORM_ROTATION)}deg) scale(${scale.x}, ${scale.y})`;

            transform.setProperty(ComponentClass.TRANSFORM_POSITION, new Vec2(x, position.y));
        }
    }

    setPositionY(y) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const position = transform.getProperty(ComponentClass.TRANSFORM_POSITION);
            const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);
            this.element.style.transform = `translate(${position.x}px, ${y}px) rotate(${transform.getProperty(ComponentClass.TRANSFORM_ROTATION)}deg) scale(${scale.x}, ${scale.y})`;

            transform.setProperty(ComponentClass.TRANSFORM_POSITION, new Vec2(position.x, y));
        }
    }

    setScaleX(x) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const position = transform.getProperty(ComponentClass.TRANSFORM_POSITION);
            const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);
            this.element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${transform.getProperty(ComponentClass.TRANSFORM_ROTATION)}deg) scale(${x}, ${scale.y})`;

            transform.setProperty(ComponentClass.TRANSFORM_SCALE, new Vec2(x, scale.y));
        }
    }

    setScaleY(y) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const position = transform.getProperty(ComponentClass.TRANSFORM_POSITION);
            const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);
            this.element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${transform.getProperty(ComponentClass.TRANSFORM_ROTATION)}deg) scale(${scale.x}, ${y})`;

            transform.setProperty(ComponentClass.TRANSFORM_SCALE, new Vec2(scale.x, y));
        }
    }

    setRotation(rotation) {
        const transform = this.node.getTransform();
        if (transform !== undefined) {
            const position = transform.getProperty(ComponentClass.TRANSFORM_POSITION);
            const scale = transform.getProperty(ComponentClass.TRANSFORM_SCALE);
            this.element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale.x}, ${scale.y})`;
        
            transform.setProperty(ComponentClass.TRANSFORM_ROTATION, rotation);
        }
    }

    setSpriteResource(resource) {
        const sprite = this.node.getSprite();
        if (sprite !== undefined) {
            sprite.setProperty(ComponentClass.SPRITE_RESOURCE, resource);

            this.element.style.width = `${resource.size.x}px`;
            this.element.style.height = `${resource.size.y}px`;
            this.element.style.backgroundImage = `url(${resource.source})`;
        }
    }

    setSpriteOriginX(x) {
        const sprite = this.node.getSprite();
        if (sprite !== undefined) {
            const origin = sprite.getProperty(ComponentClass.SPRITE_ORIGIN);
            sprite.setProperty(ComponentClass.SPRITE_ORIGIN, new Vec2(x, origin.y));

            this.element.style.left = `${-x}px`;
            this.element.style.top = `${-origin.y}px`;
            this.element.style.transformOrigin = `${x}px ${origin.y}px`;
        }
    }

    setSpriteOriginY(y) {
        const sprite = this.node.getSprite();
        if (sprite !== undefined) {
            const origin = sprite.getProperty(ComponentClass.SPRITE_ORIGIN);
            sprite.setProperty(ComponentClass.SPRITE_ORIGIN, new Vec2(origin.x, y));

            this.element.style.left = `${-origin.x}px`;
            this.element.style.top = `${-y}px`;
            this.element.style.transformOrigin = `${origin.x}px ${y}px`;
        }
    }
}