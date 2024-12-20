const text = document.querySelector("#text");
const encodedText = document.querySelector("#encodedText");
const encode = document.querySelector("#encode");
const decode = document.querySelector("#decode");

encode.addEventListener("click", e => {
    let value = text.value;
    // 对齐到 5 的倍数
    const modValue = (8 * value.length) % 5;
    if (modValue === 1) {
        value += "\"\"\"";
    } else if (modValue === 2) {
        value += "\"";
    } else if (modValue === 3) {
        value += "\"\"\"\"";
    } else if (modValue === 4) {
        value += "\"\"";
    }

    const bits = new Array(40);
    let result = "";
    for (let i = 0; i !== value.length; i += 5) {
        // 每 5 个字符转换成 8 个密文字符
        let bitIndex = 0;
        for (let j = i; j !== i + 5; ++j) {
            const ch = value.charCodeAt(j);
            bits[bitIndex] = ch & 1;
            bits[bitIndex + 1] = (ch & 2) >> 1;
            bits[bitIndex + 2] = (ch & 4) >> 2;
            bits[bitIndex + 3] = (ch & 8) >> 3;
            bits[bitIndex + 4] = (ch & 16) >> 4;
            bits[bitIndex + 5] = (ch & 32) >> 5;
            bits[bitIndex + 6] = (ch & 64) >> 6;
            bits[bitIndex + 7] = (ch & 128) >> 7;

            bitIndex += 8;
        }

        bitIndex = 0;
        for (let j = 0; j !== 8; ++j) {
            const charCode =
                bits[bitIndex] |
                (bits[bitIndex + 1] << 1) |
                (bits[bitIndex + 2] << 2) |
                (bits[bitIndex + 3] << 3) |
                (bits[bitIndex + 4] << 4);

            result += String.fromCodePoint(0x1f000 + charCode);
            bitIndex += 5;
        }
    }

    encodedText.value = result;
});

decode.addEventListener("click", e => {
    const valueArr = [...encodedText.value];

    // 每 8 个密文字符转换成 5 个字符
    const bits = new Array(40);
    let result = "";
    for (let i = 0, length = valueArr.length; i !== length; i += 8) {
        let bitIndex = 0;
        for (let j = i; j !== i + 8; ++j) {
            const charCode = valueArr[j].codePointAt(0) - 0x1f000;

            bits[bitIndex] = charCode & 1;
            bits[bitIndex + 1] = (charCode & 2) >> 1;
            bits[bitIndex + 2] = (charCode & 4) >> 2;
            bits[bitIndex + 3] = (charCode & 8) >> 3;
            bits[bitIndex + 4] = (charCode & 16) >> 4;

            bitIndex += 5;
        }

        bitIndex = 0;
        for (let j = 0; j !== 5; ++j) {
            const ch =
                bits[bitIndex] |
                (bits[bitIndex + 1] << 1) |
                (bits[bitIndex + 2] << 2) |
                (bits[bitIndex + 3] << 3) |
                (bits[bitIndex + 4] << 4) |
                (bits[bitIndex + 5] << 5) |
                (bits[bitIndex + 6] << 6) |
                (bits[bitIndex + 7] << 7);

            // 排除对齐用的字符
            if (ch !== 34) {
                result += String.fromCharCode(ch);
            }
            bitIndex += 8;
        }
    }

    text.value = result;
});