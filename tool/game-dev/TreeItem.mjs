export class TreeItem {
    /**
     * 
     * @param {string | undefined} iconSrc 
     * @param {string} name 
     * @param {TreeItem[] | undefined} children 
     */
    constructor(iconSrc, name, children) {
        const element = document.createElement("li");
        element.className = "verticalLayout";
        
        const iconAndName = document.createElement("div");
        iconAndName.className = "horizontalLayout treeItem";
        element.appendChild(iconAndName);
        
        const iconElement = document.createElement("img");
        iconElement.className = "treeItemIcon";
        if (iconSrc !== undefined) {
            iconElement.src = iconSrc;
        } else {
            iconElement.style.display = "none";
        }
        iconAndName.appendChild(iconElement);
        
        const nameElement = document.createElement("span");
        nameElement.className = "treeItemName";
        nameElement.textContent = name;
        iconAndName.appendChild(nameElement);
        
        const childrenElement = document.createElement("ol");
        childrenElement.className = "treeItemChildren";
        element.appendChild(childrenElement);
        if (children !== undefined) {
            iconElement.src = "image/chevron-down.svg";
            iconElement.style.display = "inline";
            for (const child of children) {
                childrenElement.appendChild(child.element);
            }
        }

        this.element = element;
        this.iconAndNameElement = iconAndName;
        this.iconElement = iconElement;
        this.childrenElement = childrenElement;
    }

    /**
     * 
     * @param {TreeItem} child 
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

    setSelected(selected) {
        if (selected) {
            this.iconAndNameElement.classList.add("treeItemSelected");
        } else {
            this.iconAndNameElement.classList.remove("treeItemSelected");
        }
    }
}