import { Parser } from "./Parser.mjs";

const input = document.getElementById("input");
const generate = document.getElementById("generate");
const chatAndWhite = document.getElementById("chatAndWhite");
const chatsElement = document.getElementById("chats");
const status = document.getElementById("status");

const topStatused = [];

const setStatus = str => {
    status.textContent = str;
};

generate.addEventListener("click", _ => {
    const parser = new Parser(input.value);
    const chats = parser.parse();
    for (const chat of chats) {
        const chatDiv = document.createElement("div");
        chatDiv.className = "chat";

        const nameDiv = document.createElement("div");
        nameDiv.textContent = chat.name;

        const contentDiv = document.createElement("div");
        contentDiv.append(...chat.elements);

        chatDiv.append(nameDiv, contentDiv);

        chatsElement.appendChild(chatDiv);

        if (chat.status !== null) {
            topStatused.push({
                top: chatDiv.offsetTop - chatsElement.offsetTop,
                status: chat.status
            });
        }
    }
    console.log(topStatused);
});

chatAndWhite.addEventListener("scroll", _ => {
    const scrollTop = chatAndWhite.scrollTop;
    for (let i = 0, size = topStatused.length; i !== size; ++i) {
        const { top, status } = topStatused[i];
        if (top >= scrollTop) {
            setStatus(status);
            return;
        }
    }
});
