export class SharkUid {
    static create() {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes).map(byte => byte.toString(16).padStart(2, "0")).join("");
    }
}