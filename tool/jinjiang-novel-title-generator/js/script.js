const generateButton = document.getElementById("generateButton");
const aInput = document.getElementById("aInput");
const bInput = document.getElementById("bInput");
const cInput = document.getElementById("cInput");
const dInput = document.getElementById("dInput");
const resultSpan = document.getElementById("resultSpan");
const aTexts = ["重生后", "穿越后", "嫁进豪门后", "进入娱乐圈后", "失忆后", "抑制剂失效后", "获得金手指后", "C位出道后", "分手后", "逃婚后"];
const bTexts = ["遍地仇家的我", "被虐得体无完肤的我", "想当绿茶的我", "不愿再当替身的我", "沉迷赚钱的我", "只想当咸鱼的我", "觉醒精神体的我", "变成美强惨的我", "拒绝恋爱脑的我", "带球跑的我"];
const cTexts = ["和渣攻", "和男神", "和白月光", "和反派BOSS", "和死对头", "和超人气主播", "和暗恋对象", "和影帝", "和最强战力"];
const dTexts = ["成为了双人机甲驾驶员", "被系统绑定了", "HE了", "双向攻略了", "一起种田了", "称霸末世了", "崩人设了", "改写了原作剧情", "通关了逃生游戏", "联手复仇了"];
generateButton.onclick = function () {
    const a = parseInt(aInput.value);
    const b = parseInt(bInput.value);
    const c = parseInt(cInput.value);
    const d = parseInt(dInput.value);
    if (a >= 0 && a <= 9 && b >= 0 && b <= 9 && c >= 0 && c <= 9 && d >= 0 && d <= 9) {
        const result = aTexts[a] + bTexts[b] + cTexts[c] + dTexts[d];
        resultSpan.innerText = result;
    } else {
        resultSpan.innerText = "输入不合法";
    }
};