export class NodeTreeItem {
    constructor(name) {
        const element = document.createElement("li");
        element.className = "verticalLayout";
        
        const iconAndName = document.createElement("div");
        iconAndName.className = "horizontalLayout nodeTreeItem";
        element.appendChild(iconAndName);
        
        const iconElement = document.createElement("img");
        iconElement.className = "nodeTreeItemIcon";
        iconElement.style.display = "none";
        iconAndName.appendChild(iconElement);
        
        const nameElement = document.createElement("span");
        nameElement.textContent = name;
        iconAndName.appendChild(nameElement);
        
        const childrenElement = document.createElement("ol");
        childrenElement.className = "nodeTreeChildren";
        element.appendChild(childrenElement);

        this.element = element;
        this.iconElement = iconElement;
        this.childrenElement = childrenElement;
    }

    /**
     * 
     * @param {NodeTreeItem} child 
     */
    appendChild(child) {
        this.iconElement.style.display = "inline";
        this.childrenElement.appendChild(child.element);
    }

    /**
     * 
     * @param {boolean} expanded 
     */
    setExpanded(expanded) {
        if (expanded) {
            this.iconElement.src = "image/chevron-down.svg";
            this.childrenElement.style.display = "block";
        } else {
            this.iconElement.src = "image/chevron-right.svg";
            this.childrenElement.style.display = "none";
        }
    }
}