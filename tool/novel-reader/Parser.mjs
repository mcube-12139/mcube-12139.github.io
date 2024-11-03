export class Parser {
    constructor(source) {
        this.source = source;
        this.i = -1;
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

    matchString(str) {
        for (let i = 0, size = str.length; i !== size; ++i) {
            const c = str[i];
            const c1 = this.i + i < this.source.length ? this.source[this.i + i] : null;
            if (c !== c1) {
                return false;
            }
        }

        this.i += str.length - 1;
        return true;
    }

    parseContent(...endStrs) {
        const elements = [];

        let text = "";
        for (;;) {
            const c = this.next();
            if (c === null) {
                throw new Error(`${endStrs} not found`);
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
                span.append(this.parseContent("\"")[0]);
                elements.push(span);
            } else if (c === "“") {
                const span = document.createElement("span");
                span.className = "quoted";
                span.append(this.parseContent("”")[0]);
                elements.push(span);
            } else if (this.matchString("**")) {
                const strong = document.createElement("strong");
                strong.append(this.parseContent("**")[0]);
                elements.push(strong);
            } else if (c === "*") {
                const em = document.createElement("em");
                em.append(this.parseContent("*")[0]);
                elements.push(em);
            } else if (c === "\n") {
                const br = document.createElement("br");
                elements.push(br);
            } else {
                text += c;
            }
        }
    }

    parse() {
        const chats = [];
        this.i = -1;

        while (this.lookNext() !== null) {
            // 名字
            let name = "";
            let c;
            do {
                c = this.next();
                name += c;
            } while (c !== ":");

            // 内容
            const [elements, endStr] = this.parseContent("<StatusBlock>", "\n\n");

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