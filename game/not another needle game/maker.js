const screenWidth = 800;
const screenHeight = 608;

const imageData = new Map();
imageData.set("kid", {
    path: "kid creator.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("brick", {
    path: "brick.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("platform", {
    path: "platform.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("needleU", {
    path: "needle up.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("needleD", {
    path: "needle down.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("needleL", {
    path: "needle left.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("needleR", {
    path: "needle right.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("miniNeedleU", {
    path: "mini needle up.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("miniNeedleD", {
    path: "mini needle down.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("miniNeedleL", {
    path: "mini needle left.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("miniNeedleR", {
    path: "mini needle right.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("fruit", {
    path: "fruit 0.png",
    image: null,
    offsetX: 10,
    offsetY: 12
});
imageData.set("killerBrick", {
    path: "killer brick.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("save", {
    path: "save 0.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("saveLight", {
    path: "save light 0.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("light", {
    path: "light.png",
    image: null,
    offsetX: 7,
    offsetY: 0
});
imageData.set("teleporter", {
    path: "teleporter.png",
    image: null,
    offsetX: 16,
    offsetY: 16
});
imageData.set("switch", {
    path: "switch 0.png",
    image: null,
    offsetX: 16,
    offsetY: 16
});
imageData.set("backTile", {
    path: "stage 1/back tile.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});
imageData.set("tile", {
    path: "editor/tile.png",
    image: null,
    offsetX: 0,
    offsetY: 0
});

const classData = [
    { name: "KidCreator", text: "人", image: "kid", properties: [] },
    { name: "Brick", text: "砖", image: "brick", properties: [] },
    { name: "Platform", text: "板", image: "platform", properties: [
        {
            name: "hspeed",
            type: "number",
            default: 0
        }, {
            name: "vspeed",
            type: "number",
            default: 0
        }
    ] },
    { name: "NeedleU", text: "上刺", image: "needleU", properties: [] },
    { name: "NeedleD", text: "下刺", image: "needleD", properties: [] },
    { name: "NeedleL", text: "左刺", image: "needleL", properties: [] },
    { name: "NeedleR", text: "右刺", image: "needleR", properties: [] },
    { name: "MiniNeedleU", text: "上小刺", image: "miniNeedleU", properties: [] },
    { name: "MiniNeedleD", text: "下小刺", image: "miniNeedleD", properties: [] },
    { name: "MiniNeedleL", text: "左小刺", image: "miniNeedleL", properties: [] },
    { name: "MiniNeedleR", text: "右小刺", image: "miniNeedleR", properties: [] },
    { name: "Fruit", text: "果", image: "fruit", properties: [] },
    { name: "KillerBrick", text: "死砖", image: "killerBrick", properties: [] },
    { name: "Save", text: "存档", image: "save", properties: [] },
    { name: "SaveLight", text: "灯存档", image: "saveLight", properties: [] },
    { name: "Light", text: "灯", image: "light", properties: [] },
    { name: "Teleporter", text: "门", image: "teleporter", properties: [] },
    { name: "Switch", text: "开关", image: "switch", properties: [
        {
            name: "onTrigger",
            type: "string",
            default: ""
        }
    ] },
    { name: "BackTile", text: "背景图块", image: "backTile", properties: []},
    { name: "Tile", text: "图块", image: "tile", properties: [
        {
            name: "image",
            type: "string",
            default: ""
        }
    ]},
];
const layerData = [
    { name: "kid", text: "人" },
    { name: "fruit", text: "果" },
    { name: "other", text: "其他" },
    { name: "needle", text: "刺" },
    { name: "teleporter", text: "门" },
    { name: "back", text: "背景" },
];

const Layer = {
    data: [],
    selectedIndex: 0,
    selectedNodes: [],
    visibleNodes: [],
    lockedNodes: [],
    add(data) {
        const li = document.createElement("li");

        const selectedInput = document.createElement("input");
        this.selectedNodes.push(selectedInput);
        selectedInput.type = "radio";
        selectedInput.name = "layer";
        const length = this.data.length;
        selectedInput.addEventListener("change", e => {
            this.selectedIndex = length;
        });

        const visibleInput = document.createElement("input");
        this.visibleNodes.push(visibleInput);
        visibleInput.type = "checkbox";
        visibleInput.checked = true;
        visibleInput.addEventListener("change", e => {
            this.setVisible(length, e.target.checked);
        });

        const lockedInput = document.createElement("input");
        this.lockedNodes.push(lockedInput);
        lockedInput.type = "checkbox";
        lockedInput.addEventListener("change", e => {
            this.setLocked(length, e.target.checked);
        });

        li.appendChild(selectedInput);
        li.appendChild(document.createTextNode(`${data.text} `));
        li.appendChild(visibleInput);
        li.appendChild(document.createTextNode("显示 "));
        li.appendChild(lockedInput);
        li.appendChild(document.createTextNode("锁定 "));
        layerOL.appendChild(li);
        this.data.push({
            name: data.name,
            visible: true,
            locked: false,
            objects: new Array()
        });
    },

    setVisible(index, visible) {
        this.data[index].visible = visible;
    },

    getVisible(index) {
        return this.data[index].visible;
    },

    setLocked(index, locked) {
        this.data[index].locked = locked;
    },

    getLocked(index) {
        return this.data[index].locked;
    },

    showAll() {
        for (const [i, node] of this.visibleNodes.entries()) {
            node.checked = true;
            this.data[i].visible = true;
        }
    },

    hideAll() {
        for (const [i, node] of this.visibleNodes.entries()) {
            node.checked = false;
            this.data[i].visible = false;
        }
    },

    unlockAll() {
        for (const [i, node] of this.lockedNodes.entries()) {
            node.checked = false;
            this.data[i].locked = false;
        }
    },

    lockAll() {
        for (const [i, node] of this.lockedNodes.entries()) {
            node.checked = true;
            this.data[i].locked = true;
        }
    },

    get selected() {
        return this.data[this.selectedIndex];
    }
};

const Editor = {
    create(x, y) {
        const data = classData[selectedClassIndex];
        const properties = [];
        for (const property of data.properties) {
            properties.push(property.default);
        }
        const obj = {
            index: selectedClassIndex,
            name: "",
            x: x,
            y: y,
            imageData: imageData.get(data.image),
            properties: properties
        };
        Layer.selected.objects.push(obj);
        return obj;
    },

    deleteAt(x, y) {
        const objects = Layer.selected.objects;
        for (let i = objects.length - 1; i != -1; --i) {
            const object = objects[i];
            if (x >= object.x - object.imageData.offsetX && x < object.x - object.imageData.offsetX + object.imageData.image.width && y >= object.y - object.imageData.offsetY && y < object.y - object.imageData.offsetY + object.imageData.image.height) {
                objects.splice(i, 1);
                return object;
            }
        }

        return null;
    },

    select(obj) {
        selectedObject = obj;
        propertiesUL.innerHTML = "";
        if (obj != null) {
            const objNameTextNode = document.createTextNode("name: ");
            const objNameInput = document.createElement("input");
            objNameInput.type = "text";
            objNameInput.value = obj.name;
            objNameInput.addEventListener("change", e => {
                obj.name = e.target.value;
            });
            const nameLi = document.createElement("li");
            nameLi.appendChild(objNameTextNode);
            nameLi.appendChild(objNameInput);
            propertiesUL.appendChild(nameLi);

            for (const [i, property] of obj.properties.entries()) {
                const propNameTextNode = document.createTextNode(`${classData[obj.index].properties[i].name}: `);
                const valueInput = document.createElement("input");
                valueInput.type = "text";
                const propertyType = classData[obj.index].properties[i].type;
                let changeFun;
                if (propertyType == "number") {
                    valueInput.value = property.toString();
                    changeFun = e => {
                        const newValue = Number(e.target.value);
                        if (!isNaN(newValue)) {
                            obj.properties[i] = newValue;
                        } else {
                            alert(`输入不合法，正确类型是${propertyType}`);
                        }
                    };
                } else if (propertyType == "string") {
                    valueInput.value = property;
                    changeFun = e => {
                        obj.properties[i] = e.target.value;
                    }
                }
                valueInput.addEventListener("change", changeFun);
                const propertyLi = document.createElement("li");
                propertyLi.appendChild(propNameTextNode);
                propertyLi.appendChild(valueInput);
                propertiesUL.appendChild(propertyLi);
            }
        }
    },

    getObjectAt(x, y) {
        const objects = Layer.selected.objects;
        for (let i = objects.length - 1; i != -1; --i) {
            const object = objects[i];
            if (x >= object.x - object.imageData.offsetX && x < object.x - object.imageData.offsetX + object.imageData.image.width && y >= object.y - object.imageData.offsetY && y < object.y - object.imageData.offsetY + object.imageData.image.height) {
                return object;
            }
        }

        return null;
    }
};

let selectedClassIndex = 0;
const classOptions = [];

let gridWidth = 32;
let gridHeight = 32;
let gridColor = "#ffffff80";
const gridWidthInput = document.getElementById("gridWidthInput");
const gridHeightInput = document.getElementById("gridHeightInput");

const propertiesUL = document.getElementById("propertiesUL");

const exportedTextArea = document.getElementById("exportedTextArea");

const classSelect = document.getElementById("classSelect");
classSelect.addEventListener("change", e => {
    selectedClassIndex = e.target.selectedIndex;
});
for (const cls of classData) {
    const option = document.createElement("option");
    classOptions.push(option);
    option.innerHTML = cls.text;
    classSelect.appendChild(option);
}

const layerOL = document.getElementById("layerOL");
for (const data of layerData) {
    Layer.add(data);
}
if (Layer.selectedNodes.length != 0) {
    Layer.selectedIndex = 0;
    Layer.selectedNodes[0].checked = true;
}

/**
 * @type {HTMLCanvasElement}
 */
const mainCanvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext("2d", {
    alpha: false
});

let mouseXPrev = 0;
let mouseYPrev = 0;
let creating = false;
let created = [];
let deleting = false;
let selectedObject = null;
let forceCreate = false;
mainCanvas.onmousedown = e => {
    if (e.button == 0) {
        if (!Layer.getLocked(Layer.selectedIndex)) {
            const obj = Editor.getObjectAt(e.offsetX, e.offsetY);
            if (obj == null || forceCreate) {
                creating = true;

                const mouseX = gridWidth * Math.floor(e.offsetX / gridWidth);
                const mouseY = gridHeight * Math.floor(e.offsetY / gridHeight);
                const firstCreated = Editor.create(mouseX, mouseY);
                created = [ firstCreated ];
                Editor.select(firstCreated);
                mouseXPrev = mouseX;
                mouseYPrev = mouseY;
            } else {
                Editor.select(obj);
            }
        }
    } else if (e.button == 2) {
        if (!Layer.getLocked(Layer.selectedIndex)) {
            deleting = true;

            const mouseX = gridWidth * Math.floor(e.offsetX / gridWidth);
            const mouseY = gridHeight * Math.floor(e.offsetY / gridHeight);
            if (selectedObject == Editor.deleteAt(e.offsetX, e.offsetY)) {
                Editor.select(null);
            }
            mouseXPrev = mouseX;
            mouseYPrev = mouseY;
        }
    }
};
mainCanvas.oncontextmenu = e => {
    return false;
};
mainCanvas.onmousemove = e => {
    if (creating) {
        const mouseX = gridWidth * Math.floor(e.offsetX / gridWidth);
        const mouseY = gridHeight * Math.floor(e.offsetY / gridHeight);
        if (mouseX != mouseXPrev || mouseY != mouseYPrev) {
            created.push(Editor.create(mouseX, mouseY));
        }
        mouseXPrev = mouseX;
        mouseYPrev = mouseY;
    } else if (deleting) {
        const mouseX = gridWidth * Math.floor(e.offsetX / gridWidth);
        const mouseY = gridHeight * Math.floor(e.offsetY / gridHeight);
        if (mouseX != mouseXPrev || mouseY != mouseYPrev) {
            if (selectedObject == Editor.deleteAt(e.offsetX, e.offsetY)) {
                Editor.select(null);
            }
        }
        mouseXPrev = mouseX;
        mouseYPrev = mouseY;
    }
};
mainCanvas.onmouseup = e => {
    creating = false;
    created = [];
    deleting = false;
};
document.onkeydown = e => {
    if (e.key == "Control") {
        forceCreate = true;
    }
};
document.onkeyup = e => {
    if (e.key == "Control") {
        forceCreate = false;
    }
}

let index = 0;
for (const image of imageData.values()) {
    const i = new Image();
    i.src = `image/${image.path}`;
    image.image = i;
    if (index == imageData.size - 1) {
        i.onload = e => {
            mainLoop();
        };
    }
    ++index;
}

function mainLoop() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    ctx.strokeStyle = gridColor;
    for (let drawX = 0; drawX < screenWidth; drawX += gridWidth) {
        ctx.beginPath();
        ctx.moveTo(drawX + 0.5, 0);
        ctx.lineTo(drawX + 0.5, screenHeight);
        ctx.stroke();
    }
    for (let drawY = 0; drawY < screenHeight; drawY += gridHeight) {
        ctx.beginPath();
        ctx.moveTo(0, drawY + 0.5);
        ctx.lineTo(screenWidth, drawY + 0.5);
        ctx.stroke();
    }
    ctx.strokeStyle = "#000000ff";

    for (let i = Layer.data.length - 1; i != -1; --i) {
        if (Layer.getVisible(i)) {
            const data = Layer.data[i];
            for (const object of data.objects) {
                const imageData = object.imageData;
                ctx.drawImage(imageData.image, object.x - imageData.offsetX, object.y - imageData.offsetY);
            }
        }
    }
    if (selectedObject != null) {
        ctx.strokeStyle = "#ff0000";
        ctx.strokeRect(selectedObject.x - selectedObject.imageData.offsetX + 0.5, selectedObject.y - selectedObject.imageData.offsetY + 0.5, selectedObject.imageData.image.width - 1, selectedObject.imageData.image.height - 1);
        ctx.strokeStyle = "#000000";
    }

    requestAnimationFrame(mainLoop);
}

function setGridSize(size) {
    gridWidth = size;
    gridHeight = size;
    gridWidthInput.value = size.toString();
    gridHeightInput.value = size.toString();
}

function setGridWidth(width) {
    gridWidth = width;
    gridWidthInput.value = width.toString();
}

function setGridHeight(height) {
    gridHeight = height;
    gridHeightInput.value = height.toString();
}

function setGridColor(color) {
    gridColor = color;
}

function saveRoom() {
    const result = {};
    const layers = [];
    for (const data of Layer.data) {
        const objects = [];
        for (const object of data.objects) {
            objects.push({
                index: object.index,
                name: object.name,
                x: object.x,
                y: object.y,
                properties: object.properties
            });
        }
        layers.push({
            name: data.name,
            objects: objects
        })
    }
    result["layers"] = layers;
    exportedTextArea.value = JSON.stringify(result);
}

function loadRoom() {
    const result = JSON.parse(exportedTextArea.value);
    const layers = result.layers;
    for (const [i, layer] of layers.entries()) {
        for (const object of layer.objects) {
            Layer.data[i].objects.push({
                index: object.index,
                name: object.name,
                x: object.x,
                y: object.y,
                imageData: imageData.get(classData[object.index].image),
                properties: object.properties
            });
        }
    }
}

function exportRoom() {
    const result = {};
    const layers = [];
    for (const data of Layer.data) {
        const objects = [];
        for (const object of data.objects) {
            objects.push({
                objectName: object.name,
                x: object.x,
                y: object.y,
                name: classData[object.index].name,
                properties: object.properties
            });
        }
        layers.push({
            name: data.name,
            objects: objects
        });
    }
    result["layers"] = layers;
    exportedTextArea.value = JSON.stringify(result);
}