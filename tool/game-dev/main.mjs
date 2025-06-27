import { NodeEditPage } from "./Page/NodeEditPage.mjs";
import { ResourceType } from "./Resource/ResourceType.mjs";
import { ComponentType } from "./Component/ComponentType.mjs";
import { PropertyType } from "./Property/PropertyType.mjs";
import { ResourceTool } from "./Resource/ResourceTool.mjs";
import { Component } from "./Component/Component.mjs";
import { GameNode } from "./GameNode.mjs";
import { Vec4 } from "./math/Vec4.mjs";

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
        source: "image/wall.png"
    },
    {
        id: 2,
        type: ResourceType.SPRITE,
        name: "miniWallSprite",
        parent: 0,
        previous: 1,
        next: 3,
        source: "image/miniWall.png"
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
            x: -16,
            y: -16
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
            x: -8,
            y: -8
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
        type: ComponentType.TRANSFORM,
        node: 0,
        previous: null,
        next: 1,
        prefab: null,
        properties: [
            {
                key: "position",
                type: PropertyType.VEC2,
                modified: false,
                value: {
                    x: 0,
                    y: 0
                }
            },
            {
                key: "scale",
                type: PropertyType.VEC2,
                modified: false,
                value: {
                    x: 1,
                    y: 1
                }
            },
            {
                key: "rotation",
                type: PropertyType.NUMBER,
                modified: false,
                value: 0
            }
        ]
    },
    {
        id: 1,
        type: ComponentType.SPRITE,
        node: 0,
        previous: 0,
        next: null,
        prefab: null,
        properties: [
            {
                key: "resource",
                type: PropertyType.SPRITE_RESOURCE,
                modified: false,
                value: 1
            }
        ]
    },
    {
        id: 2,
        type: ComponentType.TRANSFORM,
        node: 1,
        previous: null,
        next: 3,
        prefab: null,
        properties: [
            {
                key: "position",
                type: PropertyType.VEC2,
                modified: false,
                value: {
                    x: 0,
                    y: 0
                }
            },
            {
                key: "scale",
                type: PropertyType.VEC2,
                modified: false,
                value: {
                    x: 1,
                    y: 1
                }
            },
            {
                key: "rotation",
                type: PropertyType.NUMBER,
                modified: false,
                value: 0
            }
        ]
    },
    {
        id: 3,
        type: ComponentType.SPRITE,
        node: 1,
        previous: 2,
        next: null,
        prefab: null,
        properties: [
            {
                key: "resource",
                type: PropertyType.SPRITE_RESOURCE,
                modified: false,
                value: 2
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

const selectNodeItem = node => {
    nowPage.selectNodeItem(node);
};

let maxNodeId = -1;
const nextNodeId = () => {
    ++maxNodeId;
    return maxNodeId;
};

// 创建组件对象，统计节点的组件
const componentMap = new Map();
const componentsOfNodeMap = new Map();
(function () {
    const componentDataMap = new Map();
    for (const componentData of componentsData) {
        componentDataMap.set(componentData.id, componentData);
        componentMap.set(componentData.id, Component.fromData(componentData));
    }

    for (const componentData of componentsData) {
        if (componentData.previous === null) {
            componentsOfNodeMap.set(componentData.node, []);
            for (let data = componentData; ; ) {
                const component = componentMap.get(data.id);
                componentsOfNodeMap.get(data.node).push(component);

                if (data.next !== null) {
                    data = componentDataMap.get(data.next);
                } else {
                    break;
                }
            }
        }
    }
})();

// 创建节点对象
const nodeMap = new Map();
(function () {
    const nodeDataMap = new Map();
    for (const nodeData of nodesData) {
        nodeDataMap.set(nodeData.id, nodeData);
        const node = GameNode.fromData(nodeData);
        nodeMap.set(nodeData.id, node);

        // 添加组件
        const components = componentsOfNodeMap.get(nodeData.id);
        if (components !== undefined) {
            for (const component of components) {
                node.addComponent(component);
            }
        }

        if (nodeData.id > maxNodeId) {
            maxNodeId = nodeData.id;
        }
    }

    for (const nodeData of nodesData) {
        if (nodeData.prefab !== null) {
            // 设置预设
            nodeMap.get(nodeData.id).prefab = nodeMap.get(nodeData.prefab);
        }

        if (nodeData.parent !== null && nodeData.previous === null) {
            const parent = nodeMap.get(nodeData.parent);
            for (let data = nodeData; ; ) {
                const node = nodeMap.get(data.id);
                parent.appendChild(node);
                if (data.next !== null) {
                    data = nodeDataMap.get(data.next);
                } else {
                    break;
                }
            }
        }
    }
})(); 

// 创建资源对象
let rootResource;
const resourceMap = new Map();
(function () {
    const resourceDataMap = new Map();
    for (const resourceData of resourcesData) {
        resourceDataMap.set(resourceData.id, resourceData);
        const resource = ResourceTool.fromData(resourceData);
        resourceMap.set(resourceData.id, resource);

        if (resourceData.parent === null) {
            // 设置根资源
            rootResource = resource;
        }
    }

    // 设置资源间关系
    for (const resourceData of resourcesData) {
        if (resourceData.parent !== null && resourceData.previous === null) {
            const parent = resourceMap.get(resourceData.parent);
            for (let data = resourceData; ; ) {
                parent.appendChild(resourceMap.get(data.id));
                if (data.next !== null) {
                    data = resourceDataMap.get(data.next);
                } else {
                    break;
                }
            }
        }
    }
})();

// 设置不同类对象间引用
for (const resourceData of resourcesData) {
    if (resourceData.type === ResourceType.NODE) {
        const resource = resourceMap.get(resourceData.id);
        resource.node = nodeMap.get(resourceData.node);
    }
}
for (const componentData of componentsData) {
    for (const propertyData of componentData.properties) {
        if (propertyData.type === PropertyType.SPRITE_RESOURCE) {
            const component = componentMap.get(componentData.id);
            const resource = resourceMap.get(propertyData.value);
            component.setPropertyHacked(propertyData.key, resource);
        }
    }
}
rootResource.getTreeItem().setExpanded(true);
resourceContainer.appendChild(rootResource.getTreeItem().element);

const root = new GameNode(0, undefined, "root", undefined, [], [], new Vec4(0, 0, 0, 0), undefined, undefined);

const page = new NodeEditPage(true, true, 32, 32, "#0000007f", root);
nowPage = page;
pageContainer.appendChild(page.element);

globalThis.exportGame = () => {
    console.log(JSON.stringify(page.root, null, 4));
};

export {
    selectedResource,
    setSelectedResource,
    selectNodeItem,
    nextNodeId
};