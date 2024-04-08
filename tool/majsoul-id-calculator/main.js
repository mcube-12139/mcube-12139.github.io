const paipuHouseId = document.getElementById("paipuHouseId");
const majsoulId = document.getElementById("majsoulId");
const execute = document.getElementById("execute");

execute.addEventListener("click", e => {
    const paipuHouseIdVal = paipuHouseId.valueAsNumber;
    const id_1_2 = paipuHouseIdVal >> 26;
    const id_3_9 = (paipuHouseIdVal >> 19) & 127;
    const id_10_24 = paipuHouseIdVal & 524287;
    const swaped = (id_1_2 << 26) | (id_10_24 << 7) | id_3_9;
    const xored = swaped ^ 47625995;
    const majsoulIdVal = xored + 10000000;

    majsoulId.textContent = majsoulIdVal.toString();
});