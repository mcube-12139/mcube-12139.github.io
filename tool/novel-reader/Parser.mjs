export class Parser {
    constructor(source) {
        this.source = source;
        this.i = -1;
        this.content = "";
        this.contentIndex = -1;
    }

    next() {
        ++this.i;
        if (this.i < this.source.length) {
            return this.source[this.i];
        }

        return null;
    }

    current() {
        if (this.i < this.source.length) {
            return this.source[this.i];
        }

        return null;
    }

    lookNext() {
        if (this.i < this.source.length - 1) {
            return this.source[this.i + 1];
        }

        return null;
    }

    nextContent() {
        ++this.contentIndex;
        if (this.contentIndex < this.content.length) {
            return this.content[this.contentIndex];
        }

        return null;
    }

    lookNextContent() {
        if (this.contentIndex < this.content.length - 1) {
            return this.content[this.contentIndex + 1];
        }

        return null;
    }

    matchString(str) {
        if (str === null) {
            return this.lookNextContent() === null;
        }

        for (let i = 0, size = str.length; i !== size; ++i) {
            const c = str[i];
            const c1 = this.contentIndex + i < this.content.length ? this.content[this.contentIndex + i] : null;
            if (c !== c1) {
                return false;
            }
        }

        this.contentIndex += str.length - 1;
        return true;
    }

    parseContent(...endStrs) {
        const elements = [];

        let text = "";
        for (;;) {
            const c = this.nextContent();

            if (c === null) {
                if (this.matchString(null)) {
                    if (text.length !== 0) {
                        elements.push(text);
                    }
                    return [elements, null];
                }
            }

            for (const str of endStrs) {
                if (this.matchString(str)) {
                    if (text.length !== 0) {
                        elements.push(text);
                    }
                    return [elements, str];
                }
            }

            if (c === "\"" || c === "“" || this.matchString("**") || c === "*" || c === "\n") {
                if (text.length !== 0) {
                    elements.push(text);
                }
                text = "";
            }

            if (c === "\"") {
                const span = document.createElement("span");
                span.className = "quoted";
                const content = this.parseContent("\"");
                for (const element of content[0]) {
                    span.append(element);
                }
                elements.push(span);
            } else if (c === "“") {
                const span = document.createElement("span");
                span.className = "quoted";
                const content = this.parseContent("”");
                for (const element of content[0]) {
                    span.append(element);
                }
                elements.push(span);
            } else if (this.matchString("**")) {
                const strong = document.createElement("strong");
                const content = this.parseContent("**");
                for (const element of content[0]) {
                    strong.append(element);
                }
                elements.push(strong);
            } else if (c === "*") {
                const em = document.createElement("em");
                const content = this.parseContent("*");
                for (const element of content[0]) {
                    em.append(element);
                }
                elements.push(em);
            } else if (c === "\n") {
                const br = document.createElement("br");
                elements.push(br);
            } else {
                text += c;
            }
        }
    }

    readLine() {
        let line = "";
        for (;;) {
            const c = this.lookNext();
            if (c === "\n") {
                this.next();
                break;
            } else if (c === null) {
                line = null;
                break;
            } else {
                line += c;
                this.next();
            }
        }

        return line;
    }

    parse() {
        const chats = [];
        this.i = -1;

        // 跳过第一行
        this.readLine();

        for (let fuck = 0; fuck !== 9999; ++fuck) {
            const lineStr = this.readLine();
            if (lineStr === null) {
                break;
            }

            const line = JSON.parse(lineStr);

            const name = line.name;

            this.content = line.is_user ? line.mes : (line.swipes !== undefined ? line.swipes[line.swipe_id] : line.mes);
            this.contentIndex = -1;
            const [elements, endStr] = this.parseContent("<StatusBlock>");

            let status = null;
            if (endStr === "<StatusBlock>") {
                // 状态栏
                status = "";
                let line = "";
                for (let fuck = 0; fuck != 99999; ++fuck) {
                    const c = this.next();

                    if (this.matchString("</StatusBlock>\n\n") || this.matchString("\n\n")) {
                        if (line.length !== 0 && line !== ">```json" && line !== ">```") {
                            status += `${line}\n`;
                        }
                        break;
                    }

                    if (c === "\n") {
                        if (line.length !== 0 && line !== ">```json" && line !== ">```") {
                            status += `${line}\n`;
                        }
                        line = "";
                    } else {
                        line += c;
                    }
                }
            }
            
            chats.push({
                name: name,
                elements: elements,
                status: status
            });
        }

        return chats;
    }
}