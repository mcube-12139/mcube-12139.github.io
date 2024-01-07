class StringStreamReader {
    constructor(source) {
        /**
         * @type {string}
         */
        this.source = source;

        this.index = 0;
    }

    readLine() {
        let breakIndex = this.source.indexOf("\n", this.index);
        let endIndex;
        if (breakIndex !== -1) {
            endIndex = breakIndex;
        } else {
            endIndex = this.source.length;
        }

        const result = this.source.substring(this.index, endIndex);
        if (breakIndex !== -1) {
            this.index = endIndex + 1;
        } else {
            this.index = this.source.length;
        }

        return result;
    }

    isEnd() {
        return this.index === this.source.length;
    }
}

/**
 * @type {HTMLTextAreaElement}
 */
const input = document.getElementById("input");
const format = document.getElementById("format");
const output = document.getElementById("output");

format.addEventListener("click", e => {
    const inputText = input.value;
    const reader = new StringStreamReader(inputText);
    const result = [];

    reader.readLine();
    for ( ; ; ) {
        const line = reader.readLine();
        if (reader.isEnd()) {
            break;
        }
        if (line.startsWith("三九 魔:")) {
            result.push("我:");
            for ( ; ; ) {
                const myContent = reader.readLine();
                result.push(myContent);
                if (myContent === "") {
                    break;
                }
            }
        } else if (line.startsWith("NovelGPT:")) {
            result.push("雯雯:");
            reader.readLine();
            reader.readLine();
            for ( ; ; ) {
                const yourContent = reader.readLine();
                result.push(yourContent);
                if (yourContent === "") {
                    reader.readLine();
                    reader.readLine();
                    reader.readLine();
                    reader.readLine();
                    break;
                }
            }
        }
    }

    output.value = result.join("\n");
});