import { NodeEditPage } from "./Page/NodeEditPage.mjs";
import { ResourceType } from "./Resource/ResourceType.mjs";
import { PropertyType } from "./Property/PropertyType.mjs";
import { ResourceTool } from "./Resource/ResourceTool.mjs";
import { Component } from "./Component/Component.mjs";
import { GameNode } from "./GameNode.mjs";
import { Vec4 } from "./math/Vec4.mjs";
import { ComponentClass } from "./Component/ComponentClass.mjs";
import { IdManager } from "./IdManager.mjs";

const resourceContainer = document.querySelector("#resourceContainer");
const pageContainer = document.querySelector("#pageContainer");

const resourcesData = [
    {
        id: 0,
        type: ResourceType.ROOT,
        parent: null,
        previous: null,
        next: null
    },
    {
        id: 1,
        type: ResourceType.SPRITE,
        name: "wallSprite",
        parent: 0,
        previous: null,
        next: 2,
        source: "image/wall.png",
        size: {
            x: 32,
            y: 32
        }
    },
    {
        id: 2,
        type: ResourceType.SPRITE,
        name: "miniWallSprite",
        parent: 0,
        previous: 1,
        next: 3,
        source: "image/miniWall.png",
        size: {
            x: 16,
            y: 16
        }
    },
    {
        id: 3,
        type: ResourceType.NODE,
        name: "wall",
        parent: 0,
        previous: 2,
        next: 4,
        node: 0,
        editOrigin: {
            x: 16,
            y: 16
        }
    },
    {
        id: 4,
        type: ResourceType.NODE,
        name: "miniWall",
        parent: 0,
        previous: 3,
        next: null,
        node: 1,
        editOrigin: {
            x: 8,
            y: 8
        }
    }
];
const nodesData = [
    {
        id: 0,
        prefab: undefined,
        name: "wall",
        parent: null,
        previous: null,
        next: 1,
        contentRect: {
            x: -16,
            y: -16,
            z: 32,
            w: 32
        }
    },
    {
        id: 1,
        prefab: undefined,
        name: "miniWall",
        parent: null,
        previous: 0,
        next: null,
        contentRect: {
            x: -8,
            y: -8,
            z: 16,
            w: 16
        }
    }
];
const componentsData = [
    {
        id: 0,
        clazz: 0,
        node: 0,
        previous: null,
        next: 1,
        prefab: null,
        properties: [
            {
                modified: false,
                value: {
                    x: 0,
                    y: 0
                }
            },
            {
                modified: false,
                value: {
                    x: 1,
                    y: 1
                }
            },
            {
                modified: false,
                value: 0
            }
        ]
    },
    {
        id: 1,
        clazz: 1,
        node: 0,
        previous: 0,
        next: null,
        prefab: null,
        properties: [
            {
                modified: false,
                value: 1
            },
            {
                modified: false,
                value: {
                    x: 16,
                    y: 16
                }
            }
        ]
    },
    {
        id: 2,
        clazz: 0,
        node: 1,
        previous: null,
        next: 3,
        prefab: null,
        properties: [
            {
                modified: false,
                value: {
                    x: 0,
                    y: 0
                }
            },
            {
                modified: false,
                value: {
                    x: 1,
                    y: 1
                }
            },
            {
                modified: false,
                value: 0
            }
        ]
    },
    {
        id: 3,
        clazz: 1,
        node: 1,
        previous: 2,
        next: null,
        prefab: null,
        properties: [
            {
                modified: false,
                value: 2
            },
            {
                modified: false,
                value: {
                    x: 8,
                    y: 8
                }
            }
        ]
    }
];
const componentClassesData = [
    {
        id: 0,
        name: "Transform",
        properties: [
            {
                name: "position",
                type: PropertyType.VEC2,
                xname: "x",
                yname: "y"
            },
            {
                name: "scale",
                type: PropertyType.VEC2,
                xname: "x",
                yname: "y"
            },
            {
                name: "rotation",
                type: PropertyType.NUMBER
            }
        ]
    },
    {
        id: 1,
        name: "Sprite",
        properties: [
            {
                name: "resource",
                type: PropertyType.SPRITE_RESOURCE
            },
            {
                name: "origin",
                type: PropertyType.VEC2,
                xname: "x",
                yname: "y"
            }
        ]
    }
];
let selectedResource = undefined;
let nowPage;
const setSelectedResource = resource => {
    if (selectedResource !== undefined) {
        selectedResource.treeItem.setSelected(false);
    }
    selectedResource = resource;
    resource.treeItem.setSelected(true);
    nowPage.changeSelectedResource(resource);
};

let draggedResource = undefined;
const setDraggedResource = resource => {
    draggedResource = resource;
};

const selectNodeItem = node => {
    nowPage.selectNodeItem(node);
};

let maxNodeId = -1;
let maxComponentId = -1;
let maxResourceId = -1;
let maxComponentClassId = -1;

// 创建组件对象，统计节点的组件
const componentMap = new Map();
const componentDataMap = new Map();
for (const componentData of componentsData) {
    componentDataMap.set(componentData.id, componentData);
    componentMap.set(componentData.id, Component.fromData(componentData));

    if (componentData.id > maxComponentId) {
        // 更新最大组件 id
        maxComponentId = componentData.id;
    }
}

// 创建节点对象
const nodeMap = new Map();
const nodeDataMap = new Map();
for (const nodeData of nodesData) {
    nodeDataMap.set(nodeData.id, nodeData);
    const node = GameNode.fromData(nodeData);
    nodeMap.set(nodeData.id, node);

    if (nodeData.id > maxNodeId) {
        // 更新最大节点 id
        maxNodeId = nodeData.id;
    }
}

// 创建资源对象
let rootResource;
const resourceMap = new Map();
const resourceDataMap = new Map();
for (const resourceData of resourcesData) {
    resourceDataMap.set(resourceData.id, resourceData);
    const resource = ResourceTool.fromData(resourceData);
    resourceMap.set(resourceData.id, resource);

    if (resourceData.parent === null) {
        // 设置根资源
        rootResource = resource;
    }
    if (resourceData.id > maxResourceId) {
        // 更新最大 id
        maxResourceId = resourceData.id;
    }
}

// 创建组件类对象
const componentClassMap = new Map();
for (const componentClassData of componentClassesData) {
    componentClassMap.set(componentClassData.id, ComponentClass.fromData(componentClassData));
    if (componentClassData.id > maxComponentClassId) {
        maxComponentClassId = componentClassData.id;
    }
}

const idManager = new IdManager(maxNodeId, maxComponentId, maxResourceId, maxComponentClassId);

// 设置不同类对象间引用
// 节点 -> 组件
for (const componentData of componentsData) {
    if (componentData.previous === null) {
        const components = [];

        for (let data = componentData; ; ) {
            const component = componentMap.get(data.id);
            components.push(component);

            if (data.next !== null) {
                data = componentDataMap.get(data.next);
            } else {
                break;
            }
        }

        nodeMap.get(componentData.node).components = components;
    }
}

// 节点 -> 节点(长节点), 节点(预设), 节点(子节点)
for (const nodeData of nodesData) {
    if (nodeData.prefab !== null) {
        // 设置预设
        nodeMap.get(nodeData.id).prefab = nodeMap.get(nodeData.prefab);
    }

    if (nodeData.parent !== null && nodeData.previous === null) {
        const parent = nodeMap.get(nodeData.parent);
        nodeMap.get(nodeData.id).parent = parent;

        const children = [];
        for (let data = nodeData; ; ) {
            children.push(nodeMap.get(data.id));
            if (data.next !== null) {
                data = nodeDataMap.get(data.next);
            } else {
                break;
            }
        }
        parent.children = children;
    }
}

// 资源 -> 资源(长资源), 资源(子资源)
for (const resourceData of resourcesData) {
    if (resourceData.parent !== null && resourceData.previous === null) {
        const parent = resourceMap.get(resourceData.parent);
        resourceMap.get(resourceData.id).parent = parent;

        const children = [];
        for (let data = resourceData; ; ) {
            children.push(resourceMap.get(data.id));
            if (data.next !== null) {
                data = resourceDataMap.get(data.next);
            } else {
                break;
            }
        }
        parent.children = children;
    }
}

// 节点资源 -> 节点
for (const resourceData of resourcesData) {
    if (resourceData.type === ResourceType.NODE) {
        const resource = resourceMap.get(resourceData.id);
        resource.node = nodeMap.get(resourceData.node);
    }
}

// 组件 -> 组件类, 组件(预设)
for (const componentData of componentsData) {
    const component = componentMap.get(componentData.id);
    const clazz = componentClassMap.get(componentData.clazz);
    component.clazz = clazz;
    component.prefab = componentMap.get(componentData.prefab);

    // 由组件类读取属性
    const properties = [];
    for (const [i, propertyClass] of clazz.properties.entries()) {
        const property = propertyClass.instanceFromData(componentData.properties[i]);

        if (propertyClass.getType() === PropertyType.SPRITE_RESOURCE) {
            const resource = resourceMap.get(componentData.properties[i].value);
            property.value = resource;
        }

        properties.push(property);
    }
    component.properties = properties;
}

rootResource.getTreeItem().setExpanded(true);
resourceContainer.appendChild(rootResource.getTreeItem().element);

const root = new GameNode(0, undefined, "root", undefined, [], [], new Vec4(0, 0, 0, 0));

const page = new NodeEditPage(true, true, 32, 32, "#0000007f", root);
nowPage = page;
pageContainer.appendChild(page.element);

globalThis.exportGame = () => {
    console.log(JSON.stringify(page.root, null, 4));
};

export {
    selectedResource,
    setSelectedResource,
    draggedResource,
    setDraggedResource,
    selectNodeItem,
    idManager
};