const filterInput = document.getElementById("filter");
const executeButton = document.getElementById("executeFilter");
const resultArea = document.getElementById("result");

const charPinyin = new Map();
const indexWords = [];

for (const word of words) {
    let key = [[]];
    for (const ch of word) {
        let pinyin;
        // 获取该字的所有拼音
        if (charPinyin.has(ch)) {
            pinyin = charPinyin.get(ch);
        } else {
            const p = pinyinPro.pinyin(ch, {
                type: "all",
                toneType: "num",
                multiple: true
            });
            pinyin = p.map(v => ({
                initial: v.initial,
                final: v.final.substring(0, v.final.length - v.num.toString().length),
                num: v.num.toString(),
                char: ch
            }));
            charPinyin.set(ch, pinyin);
        }

        const newKey = [];
        for (const k of key) {
            for (const p of pinyin) {
                newKey.push(k.concat(p));
            }
        }
        key = newKey;
    }
    for (const k of key) {
        indexWords.push({
            key: k,
            word: word
        });
    }
}

let filtered = new Array(indexWords.length).fill(true);

const ConditionType = {
    NON_EXIST: 0,
    EXIST: 1,
    CORRECT: 2
};

const ContentType = {
    INITIAL: 0,
    FINAL: 1,
    NUM: 2,
    CHAR: 3
};

executeButton.addEventListener("click", e => {
    const text = filterInput.value;
    const words = text.split(" ");

    const contentTypes = [
        ContentType.INITIAL,
        ContentType.FINAL,
        ContentType.NUM,
        ContentType.CHAR
    ];
    const conditions = [];
    let wordIndex = 0;
    // 解析输入条件
    for (const word of words) {
        let index = 0;
        for (let i = 0; i !== 4; ++i) {
            const contentType = contentTypes[i];
            if (word[index] === "!") {
                // 不存在
                const alphas = getAlphas(word, index + 1);
                index = alphas.end;
                conditions.push({
                    type: ConditionType.NON_EXIST,
                    contentType: contentType,
                    content: alphas.alphas,
                    wordIndex: wordIndex
                });
            } else if (word[index] === ".") {
                // 存在
                const alphas = getAlphas(word, index + 1);
                index = alphas.end;
                conditions.push({
                    type: ConditionType.EXIST,
                    contentType: contentType,
                    content: alphas.alphas,
                    wordIndex: wordIndex
                });
            } else if (word[index] === "=") {
                // 正确
                const alphas = getAlphas(word, index + 1);
                index = alphas.end;
                conditions.push({
                    type: ConditionType.CORRECT,
                    contentType: contentType,
                    content: alphas.alphas,
                    wordIndex: wordIndex
                });
            } else {
                // 不明符号
                alert("Error");
                throw `unknown condition type: ${word[index]}`;
            }
        }
        ++wordIndex;
    }

    // 排序条件
    // "正确"优于"存在"，"存在"优于"不存在"
    // 避免属性值有多个时，"存在"先用掉了"正确"的位置，导致"正确"检测失败等问题
    conditions.sort((a, b) => b.type - a.type);
    for (const [i, word] of indexWords.entries()) {
        if (filtered[i]) {
            // 各个字的属性是否用过
            // 如果被作为了属性值存在或正确的条件，就不能再用第二次
            const used = [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false]
            ];
            
            // 根据条件过滤
            for (const condition of conditions) {
                if (condition.type === ConditionType.NON_EXIST) {
                    if (condition.contentType === ContentType.INITIAL) {
                        for (const [kIndex, k] of word.key.entries()) {
                            if (!used[kIndex][0] && k.initial === condition.content) {
                                // 存在这个声母，过滤掉
                                filtered[i] = false;
                            }
                        }
                    } else if (condition.contentType === ContentType.FINAL) {
                        for (const [kIndex, k] of word.key.entries()) {
                            if (!used[kIndex][1] && k.final === condition.content) {
                                filtered[i] = false;
                            }
                        }
                    } else if (condition.contentType === ContentType.NUM) {
                        for (const [kIndex, k] of word.key.entries()) {
                            if (!used[kIndex][2] && k.num === condition.content) {
                                filtered[i] = false;
                            }
                        }
                    } else if (condition.contentType === ContentType.CHAR) {
                        for (const [kIndex, k] of word.key.entries()) {
                            if (!used[kIndex][3] && k.char === condition.content) {
                                filtered[i] = false;
                            }
                        }
                    }
                } else if (condition.type === ConditionType.EXIST) {
                    if (condition.contentType === ContentType.INITIAL) {
                        checkExist: {
                            for (const [kIndex, k] of word.key.entries()) {
                                if (kIndex !== condition.wordIndex && !used[kIndex][0] && k.initial === condition.content) {
                                    // 存在这个声母，标记为用过，跳过过滤
                                    used[kIndex][0] = true;
                                    break checkExist;
                                }
                            }
                            filtered[i] = false;
                        }
                    } else if (condition.contentType === ContentType.FINAL) {
                        checkExist: {
                            for (const [kIndex, k] of word.key.entries()) {
                                if (kIndex !== condition.wordIndex && !used[kIndex][1] && k.final === condition.content) {
                                    used[kIndex][1] = true;
                                    break checkExist;
                                }
                            }
                            filtered[i] = false;
                        }
                    } else if (condition.contentType === ContentType.NUM) {
                        checkExist: {
                            for (const [kIndex, k] of word.key.entries()) {
                                if (kIndex !== condition.wordIndex && !used[kIndex][2] && k.num === condition.content) {
                                    used[kIndex][2] = true;
                                    break checkExist;
                                }
                            }
                            filtered[i] = false;
                        }
                    } else if (condition.contentType === ContentType.CHAR) {
                        checkExist: {
                            for (const [kIndex, k] of word.key.entries()) {
                                if (kIndex !== condition.wordIndex && !used[kIndex][3] && k.char === condition.content) {
                                    used[kIndex][3] = true;
                                    break checkExist;
                                }
                            }
                            filtered[i] = false;
                        }
                    }
                } else if (condition.type === ConditionType.CORRECT) {
                    if (condition.contentType === ContentType.INITIAL) {
                        if (word.key[condition.wordIndex].initial !== condition.content) {
                            // 声母不对，过滤掉
                            filtered[i] = false;
                        } else {
                            used[condition.wordIndex][0] = true;
                        }
                    } else if (condition.contentType === ContentType.FINAL) {
                        if (word.key[condition.wordIndex].final !== condition.content) {
                            filtered[i] = false;
                        } else {
                            used[condition.wordIndex][1] = true;
                        }
                    } else if (condition.contentType === ContentType.NUM) {
                        if (word.key[condition.wordIndex].num !== condition.content) {
                            filtered[i] = false;
                        } else {
                            used[condition.wordIndex][2] = true;
                        }
                    } else if (condition.contentType === ContentType.CHAR) {
                        if (word.key[condition.wordIndex].char !== condition.content) {
                            filtered[i] = false;
                        } else {
                            used[condition.wordIndex][3] = true;
                        }
                    }
                }
            }
        }
    }

    // 把过滤后结果去重，输出
    const result = new Set();
    for (const [i, word] of indexWords.entries()) {
        if (filtered[i]) {
            result.add(word.word);
        }
    }
    resultArea.value = [...result].join("\n");
});

function getAlphas(str, start) {
    let end = start;
    while (str[end] !== "!" && str[end] !== "." && str[end] !== "=") {
        ++end;
        if (end >= str.length) {
            break;
        }
    }
    return {
        alphas: str.substring(start, end),
        end: end
    };
}