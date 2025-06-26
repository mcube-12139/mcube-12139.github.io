import { TreeItem } from "./TreeItem.mjs";
import { Vec2 } from "./math/Vec2.mjs";
import { NodeEditPage } from "./Page/NodeEditPage.mjs";
import { ResourceType } from "./Resource/ResourceType.mjs";
import { ComponentType } from "./Component/ComponentType.mjs";
import { PropertyType } from "./Property/PropertyType.mjs";
import { Component } from "./Component/Component.mjs";
import { RootResource } from "./Resource/RootResource.mjs";
import { ResourceTool } from "./Resource/ResourceTool.mjs";

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
        next: 2
    },
    {
        id: 2,
        type: ResourceType.SPRITE,
        name: "miniWallSprite",
        parent: 0,
        previous: 1,
        next: 3
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
        parent: null,
        contentRect: {
            x: -16,
            y: -16,
            z: 32,
            w: 32
        }
    },
    {
        id: 1,
        parent: null,
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

// 创建资源对象
let rootResource;
const resourceMap = new Map();
(function() {
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

const componentMap = new Map();
resourceContainer.appendChild(rootResource.treeItem.element);

const rootElement = document.createElement("div");

const root = {
    id: "b6e1140f89b67245fb03f25c1d4132a7",
    parent: undefined,
    children: [],
    components: [
        {
            id: "0eebb34ffeec15d19b4661d4c4642a45",
            position: new Vec2(0, 0)
        }
    ],
    element: rootElement,
    treeItem: new TreeItem(undefined, "root", undefined)
};

const page = new NodeEditPage(true, true, 32, 32, "#0000007f", root);
nowPage = page;
pageContainer.appendChild(page.element);

globalThis.exportGame = () => {
    console.log(JSON.stringify(page.root, null, 4));
};

function getResource(id) {
    return resourceMap.get(id);
}

function getComponent(id) {
    return componentMap.get(id);
}

export {
    selectedResource,
    setSelectedResource,
    getResource,
    getComponent
};