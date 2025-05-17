import { BaseMahjong } from "./BaseMahjong.mjs";

const text = document.querySelector("#text");
const encodedText = document.querySelector("#encodedText");
const encode = document.querySelector("#encode");
const decode = document.querySelector("#decode");

encode.addEventListener("click", e => {
    encodedText.value = BaseMahjong.encode(text.value);
});

decode.addEventListener("click", e => {
    text.value = BaseMahjong.decode(encodedText.value);
});