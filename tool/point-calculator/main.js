const fanInput = document.getElementById("fanInput");
const fuInput = document.getElementById("fuInput");
const otherZimoInput = document.getElementById("otherZimoInput");
const otherRonInput = document.getElementById("otherRonInput");
const eastZimoInput = document.getElementById("eastZimoInput");
const eastRonInput = document.getElementById("eastRonInput");
const pointSpan = document.getElementById("pointSpan");
const payMessageDiv = document.getElementById("payMessageDiv");
const pointNameDiv = document.getElementById("pointNameDiv");
function letsGo() {
    let fan = parseInt(fanInput.value);
    let fu = parseInt(fuInput.value);
    let a = fu * 2 ** (2 + fan);

    let pointName = "";

    if ((fan < 5 && a > 2000) || fan == 5) {
        a = 2000;
        pointName = "满贯";
    } else if (fan >= 6 && fan <= 7) {
        a = 3000;
        pointName = "跳满";
    } else if (fan >= 8 && fan <= 10) {
        a = 4000;
        pointName = "倍满";
    } else if (fan >= 11 && fan <= 12) {
        a = 6000;
        pointName = "三倍满";
    } else if (fan >= 13) {
        a = 8000;
        pointName = "累计役满";
    }
    
    let eastPay;
    let otherPay;
    let loserPay;
    let payMessage;
    let total;
    if (otherZimoInput.checked) {
        eastPay = ceil100(2 * a);
        otherPay = ceil100(a);
        total = eastPay + 2 * otherPay;
        payMessage = `庄家${eastPay} 闲家${otherPay}`;
    } else if (otherRonInput.checked) {
        loserPay = ceil100(4 * a);
        total = loserPay;
        payMessage = "";
    } else if (eastZimoInput.checked) {
        otherPay = ceil100(2 * a);
        total = 3 * otherPay;
        payMessage = `各家${otherPay}`;
    } else if (eastRonInput.checked) {
        loserPay = ceil100(6 * a);
        total = loserPay;
        payMessage = "";
    } else {
        total = 0;
        payMessage = "未选择和牌方式，请重新选择";
    }

    pointSpan.innerHTML = total.toString();
    payMessageDiv.innerHTML = payMessage;
    pointNameDiv.innerHTML = pointName;
}

function ceil100(n) {
    return 100 * Math.ceil(n / 100);
}