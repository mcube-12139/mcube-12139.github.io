export class IdManager {
    constructor(maxNodeId, maxComponentId, maxResourceId, maxComponentClassId) {
        this.maxNodeId = maxNodeId;
        this.maxComponentId = maxComponentId;
        this.maxResourceId = maxResourceId;
        this.maxComponentClassId = maxComponentClassId;
    }

    nextNodeId() {
        ++this.maxNodeId;
        return this.maxNodeId;
    }

    nextComponentId() {
        ++this.maxComponentId;
        return this.maxComponentId;
    }

    nextResourceId() {
        ++this.maxResourceId;
        return this.maxResourceId;
    }

    nextComponentClassId() {
        ++this.maxComponentClassId;
        return this.maxComponentClassId;
    }
}