export class TreeItem {
    /**
     * 
     * @param {string | undefined} iconSrc 
     * @param {string} name 
     * @param {TreeItem[]} children 
     */
    constructor(iconSrc, name, children) {
        const element = document.createElement("li");
        element.className = "verticalLayout";
        
        const iconAndName = document.createElement("div");
        iconAndName.className = "horizontalLayout treeItem";
        element.appendChild(iconAndName);
        
        const chevronElement = document.createElement("img");
        iconAndName.appendChild(chevronElement);
        chevronElement.className = "treeItemIcon";

        const iconElement = document.createElement("img");
        iconAndName.appendChild(iconElement);
        iconElement.className = "treeItemIcon";
        if (iconSrc !== undefined) {
            iconElement.src = iconSrc;
        } else {
            iconElement.style.display = "none";
        }
        
        const nameElement = document.createElement("span");
        nameElement.className = "treeItemName";
        nameElement.textContent = name;
        iconAndName.appendChild(nameElement);
        
        const childrenElement = document.createElement("ol");
        childrenElement.className = "treeItemChildren";
        element.appendChild(childrenElement);
        if (children.length !== 0) {
            chevronElement.src = "image/chevron-down.svg";
            for (const child of children) {
                childrenElement.appendChild(child.element);
            }
        } else {
            chevronElement.style.display = "none";
        }

        this.element = element;
        this.iconAndNameElement = iconAndName;
        this.chevronElement = chevronElement;
        this.iconElement = iconElement
        this.childrenElement = childrenElement;
    }

    /**
     * 
     * @param {TreeItem} child 
     */
    appendChild(child) {
        this.chevronElement.style.display = "";
        this.chevronElement.src = "image/chevron-down.svg";
        this.childrenElement.appendChild(child.element);
    }

    /**
     * 
     * @param {boolean} expanded 
     */
    setExpanded(expanded) {
        if (expanded) {
            this.chevronElement.src = "image/chevron-down.svg";
            this.childrenElement.style.display = "";
        } else {
            this.chevronElement.src = "image/chevron-right.svg";
            this.childrenElement.style.display = "none";
        }
    }

    setSelected(selected) {
        if (selected) {
            this.iconAndNameElement.classList.add("treeItemSelected");
        } else {
            this.iconAndNameElement.classList.remove("treeItemSelected");
        }
    }
}