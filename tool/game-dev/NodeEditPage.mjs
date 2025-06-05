import { NodeEditToolCreate } from "./NodeEditToolCreate.mjs";

export class NodeEditPage {
    constructor(gridVisible, gridSnap, gridWidth, gridHeight, gridColor) {
        const element = document.createElement("div");
        element.className = "page";

        // 节点树
        const nodeTreeBlock = document.createElement("div");
        nodeTreeBlock.className = "verticalLayout block";
        element.appendChild(nodeTreeBlock);

        const nodeTreeTitle = document.createElement("div");
        nodeTreeTitle.className = "container";
        nodeTreeTitle.textContent = "节点树";
        nodeTreeBlock.appendChild(nodeTreeTitle);

        const nodeTreeContainer = document.createElement("div");
        nodeTreeContainer.className = "container";
        nodeTreeBlock.appendChild(nodeTreeContainer);

        const nodeTree = document.createElement("ol");
        nodeTreeContainer.appendChild(nodeTree);

        // 工具栏 & 场景
        const toolbarAndSceneContainer = document.createElement("div");
        toolbarAndSceneContainer.className = "verticalLayout grow";
        element.appendChild(toolbarAndSceneContainer);

        // 工具栏
        const toolbarBlock = document.createElement("div");
        toolbarBlock.className = "verticalLayout container block";
        toolbarAndSceneContainer.appendChild(toolbarBlock);

        // 工具
        const toolLayout = document.createElement("div");
        toolLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(toolLayout);

        const toolTitle = document.createTextNode("工具");
        toolLayout.appendChild(toolTitle);

        const createRadio = document.createElement("input");
        createRadio.type = "radio";
        createRadio.name = "nodeEditTool";
        createRadio.checked = true;
        toolLayout.appendChild(createRadio);

        const createLabel = document.createTextNode("创建");
        toolLayout.appendChild(createLabel);

        const deleteRadio = document.createElement("input");
        deleteRadio.type = "radio";
        deleteRadio.name = "nodeEditTool";
        toolLayout.appendChild(deleteRadio);

        const deleteLabel = document.createTextNode("删除");
        toolLayout.appendChild(deleteLabel);

        const selectRadio = document.createElement("input");
        selectRadio.type = "radio";
        selectRadio.name = "nodeEditTool";
        toolLayout.appendChild(selectRadio);

        const selectLabel = document.createTextNode("选择");
        toolLayout.appendChild(selectLabel);

        const selectRegionRadio = document.createElement("input");
        selectRegionRadio.type = "radio";
        selectRegionRadio.name = "nodeEditTool";
        toolLayout.appendChild(selectRegionRadio);

        const selectRegionLabel = document.createTextNode("框选");
        toolLayout.appendChild(selectRegionLabel);

        // 网格
        const gridLayout = document.createElement("div");
        gridLayout.className = "horizontalLayout";

        const gridTitle = document.createTextNode("网格");
        gridLayout.appendChild(gridTitle);

        const gridVisibleInput = document.createElement("input");
        gridVisibleInput.type = "checkbox";
        gridVisibleInput.checked = true;
        gridLayout.appendChild(gridVisibleInput);

        const gridVisibleLabel = document.createTextNode("显示");
        gridLayout.appendChild(gridVisibleLabel);

        const gridSnap = document.createElement("input");
        gridSnap.type = "checkbox";
        gridSnap.checked = true;
        gridLayout.appendChild(gridSnap);

        const gridSnapLabel = document.createTextNode("吸附");
        gridLayout.appendChild(gridSnapLabel);

        const gridWidthLabel = document.createTextNode("宽度");
        gridLayout.appendChild(gridWidthLabel);

        const gridWidthInput = document.createElement("input");
        gridWidthInput.className = "shortInput";
        gridWidthInput.type = "number";
        gridWidthInput.valueAsNumber = gridWidth;
        gridLayout.appendChild(gridWidthInput);

        const gridHeightLabel = document.createTextNode("高度");
        gridLayout.appendChild(gridHeightLabel);

        const gridHeightInput = document.createElement("input");
        gridHeightInput.className = "shortInput";
        gridHeightInput.type = "number";
        gridHeightInput.valueAsNumber = gridHeight;
        gridLayout.appendChild(gridHeightInput);

        const gridSize32Button = document.createElement("button");
        gridSize32Button.textContent = "32";
        gridLayout.appendChild(gridSize32Button);

        const gridSize16Button = document.createElement("button");
        gridSize16Button.textContent = "16";
        gridLayout.appendChild(gridSize16Button);

        const gridSize8Button = document.createElement("button");
        gridSize8Button.textContent = "8";
        gridLayout.appendChild(gridSize8Button);

        const gridSize4Button = document.createElement("button");
        gridSize4Button.textContent = "4";
        gridLayout.appendChild(gridSize4Button);

        // 选项
        const optionLayout = document.createElement("div");
        optionLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(optionLayout);
        
        const optionTitle = document.createTextNode("选项");
        optionLayout.appendChild(optionTitle);

        const overlapEnabled = document.createElement("input");
        overlapEnabled.type = "checkbox";
        optionLayout.appendChild(overlapEnabled);

        const overlapEnabledLabel = document.createTextNode("重叠");
        optionLayout.appendChild(overlapEnabledLabel);

        const penetrateEnabled = document.createElement("input");
        penetrateEnabled.type = "checkbox";
        optionLayout.appendChild(penetrateEnabled);

        const penetrateEnabledLabel = document.createTextNode("穿透");
        optionLayout.appendChild(penetrateEnabledLabel);

        const multiselectEnabled = document.createElement("input");
        multiselectEnabled.type = "checkbox";
        optionLayout.appendChild(multiselectEnabled);

        const multiselectEnabledLabel = document.createTextNode("多选");
        optionLayout.appendChild(multiselectEnabledLabel);

        // 操作
        const operateLayout = document.createElement("div");
        operateLayout.className = "horizontalLayout";
        toolbarBlock.appendChild(operateLayout);

        const operateTitle = document.createTextNode("操作");
        operateLayout.appendChild(operateTitle);

        const saveButton = document.createElement("button");
        saveButton.textContent = "保存"
        operateLayout.appendChild(saveButton);

        const undoButton = document.createElement("button");
        undoButton.textContent = "撤销"
        operateLayout.appendChild(undoButton);

        const redoButton = document.createElement("button");
        redoButton.textContent = "重做"
        operateLayout.appendChild(redoButton);

        const cutButton = document.createElement("button");
        cutButton.textContent = "剪切"
        operateLayout.appendChild(cutButton);

        const copyButton = document.createElement("button");
        copyButton.textContent = "复制"
        operateLayout.appendChild(copyButton);

        const pasteButton = document.createElement("button");
        pasteButton.textContent = "粘贴"
        operateLayout.appendChild(pasteButton);

        // 场景
        const sceneElement = document.createElement("div");
        sceneElement.className = "scene grow";
        toolbarAndSceneContainer.appendChild(sceneElement);

        const nodeContainerElement = document.createElement("div");
        nodeContainerElement.className = "nodeContainer";
        sceneElement.appendChild(nodeContainerElement);

        const gridCanvas = document.createElement("canvas");
        gridCanvas.className = "gridCanvas";
        sceneElement.appendChild(gridCanvas);

        // 检查器
        const inspectorBlock = document.createElement("div");
        inspectorBlock.className = "verticalLayout block";
        element.appendChild(inspectorBlock);

        const inspectorTitle = document.createElement("div");
        inspectorTitle.className = "container";
        inspectorTitle.textContent = "检查器";
        inspectorBlock.appendChild(inspectorTitle);

        this.tool = new NodeEditToolCreate(this);
        this.gridVisible = gridVisible;
        
        nodeEditToolCreate.addEventListener("change", e => {
            page.tool = new NodeEditToolCreate(page);
        });
        nodeEditToolDelete.addEventListener("change", e => {
            page.tool = new NodeEditToolDelete(page);
        });
        nodeEditToolSelect.addEventListener("change", e => {
            page.tool = new NodeEditToolSelect(page);
        });
        nodeEditToolSelectRegion.addEventListener("change", e => {
            page.tool = new NodeEditToolSelectRegion(page);
        });
        gridVisibleInput.addEventListener("change", e => {
            page.setGridVisible(gridVisibleInput.checked);
        });
        gridSnap.addEventListener("change", e => {
            page.gridSnap = gridSnap.checked;
        });
        gridWidth.addEventListener("change", e => {
            if (gridWidth.valueAsNumber >= 2) {
                page.setGridSize(gridWidth.valueAsNumber, page.gridSize.y);
            } else {
                gridWidth.valueAsNumber = page.gridSize.x;
            }
        });
        gridHeight.addEventListener("change", e => {
            if (gridHeight.valueAsNumber >= 2) {
                page.setGridSize(page.gridSize.x, gridHeight.valueAsNumber);
            } else {
                gridHeight.valueAsNumber = page.gridSize.y;
            }
        });
        gridSize32.addEventListener("pointerup", e => {
            page.setGridSize(32, 32);
        });
        gridSize16.addEventListener("pointerup", e => {
            page.setGridSize(16, 16);
        });
        gridSize8.addEventListener("pointerup", e => {
            page.setGridSize(8, 8);
        });
        gridSize4.addEventListener("pointerup", e => {
            page.setGridSize(4, 4);
        });
    }
}