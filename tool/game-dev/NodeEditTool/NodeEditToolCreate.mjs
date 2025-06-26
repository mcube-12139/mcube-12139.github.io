export class NodeEditToolCreate {
    constructor(page) {
        this.page = page;
    }

    /**
     * 
     * @param {PointerEvent} event 
     */
    pointerDown(event) {
        this.page.pointerDownCreate(event.offsetX, event.offsetY);
    }

    pointerMove(event) {
        this.page.pointerMoveCreate(event.offsetX, event.offsetY);
    }

    pointerUp(event) {
        this.page.pointerUpCreate(event.offsetX, event.offsetY);
    }
}