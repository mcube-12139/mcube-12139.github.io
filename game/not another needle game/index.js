const HITBOX_RECT = 0;
const HITBOX_PREC = 1;
const HITBOX_ROTATED_RECT = 2;
const gameWidth = 800;
const gameHeight = 608;
const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

/**
 * @type {HTMLCanvasElement}
 */
const mainCanvas = document.getElementById("mainCanvas");
mainCanvas.style.position = "absolute";
mainCanvas.width = gameWidth;
mainCanvas.height = gameHeight;
const mainContext = mainCanvas.getContext("2d", {
    alpha: false
});
ctx = mainContext;
ctx.textAlign = "left";
ctx.textBaseline = "top";

let jumpButton = null;
let retryButton = null;
let leftButton = null;
let rightButton = null;

const Game = {
    fileIndex: -1,
    /**
     * @type {HTMLCanvasElement?}
     */
    foreCanvas: null,
    /**
     * @type {CanvasRenderingContext2D?}
     */
    foreContext: null,
    levels: [],
    level: 0,
    stageSettings: null,
    get stageSetting() {
        return this.stageSettings[this.stage]
    },
    stage: 0,
    kidTeleported: false,
    kidTeleportX: 0,
    kidTeleportY: 0,
    kidTeleportScaleX: 1,
    death: 0,
    time: 0,
    now: 0,
    saveData: {
        death: 0,
        time: 0,
        kidX: 321,
        kidY: 407,
        kidScaleX: 1,
        level: 0,
        stage: 0
    },
    screenShot: null,
    nowMusic: null,
    nowMusicBuffer: null,
    screenAlpha: 0,
    fadeTimer: 1,

    saveDeathTime() {
        this.saveData.death = this.death;
        this.saveData.time = this.time;
        localStorage.setItem(`saveData${this.fileIndex}`, JSON.stringify(this.saveData));
    },

    saveScreen() {
        localStorage.setItem(`screenShot${this.fileIndex}`, mainCanvas.toDataURL());
    },

    loadScreen() {
        const screenShot = localStorage.getItem(`screenShot${this.fileIndex}`);
        if (screenShot !== null) {
            this.screenShot = new Image();
            this.screenShot.src = screenShot;
        } else {
            this.screenShot = null;
        }
    },

    load() {
        this.kidTeleported = true;
        this.kidTeleportX = this.saveData.kidX;
        this.kidTeleportY = this.saveData.kidY;
        this.kidTeleportScaleX = this.saveData.kidScaleX;
        this.level = this.saveData.level;
        this.stage = this.saveData.stage;
        this.death = this.saveData.death;
        this.time = this.saveData.time;
        Room.open(LevelRoom);
    },

    reset() {
        this.fileIndex = -1;
        this.level = 0;
        this.stage = 0;
        this.kidTeleported = false;
        this.kidTeleportX = 0;
        this.kidTeleportY = 0;
        this.kidTeleportScaleX = 1;
        this.death = 0;
        this.time = 0;
        this.now = 0;
        this.saveData = {
            death: 0,
            time: 0,
            kidX: 321,
            kidY: 407,
            kidScaleX: 1,
            level: 0,
            stage: 0,
        };
        this.screenAlpha = 0;
        this.fadeTimer = 1;
    }
};

let ObjectName = {};

const Sound = {
    context: new AudioContext(),
    load(path, onload = null) {
        const request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            Sound.context.decodeAudioData(request.response, buffer => {
                Sound[path] = buffer;
                onload?.(buffer);
            });
        }

        request.send();
    },

    get(path) {
        return Sound[path];
    },

    play(buffer, loop = false) {
        const source = this.context.createBufferSource();
        source.loop = loop;
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0);
        return source;
    },

    stop(buffer) {
        buffer.disconnect();
    }
};

const HitboxBitmap = {
    needleU: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    needleD: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    needleL: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
    needleR: [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    miniNeedleU: [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    miniNeedleD: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
    miniNeedleL: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
    miniNeedleR: [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    fruit: [[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, false, false, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]]
};

const GameImage = {
    load(path, onload = null) {
        const image = new Image();
        image.src = path;
        image.onload = e => {
            onload?.(e);
        };
        return image;
    }
};

class Sprite {
    constructor(srcs, originX = 0, originY = 0, onload = null) {
        this.width = 0;
        this.height = 0;
        this.originX = originX;
        this.originY = originY;
        this.images = [];

        for (const src of srcs) {
            const image = new Image();
            image.src = src;
            this.images.push(image);
        }
        const that = this;
        const lastImage = this.images[srcs.length - 1]
        lastImage.onload = e => {
            that.width = lastImage.width;
            that.height = lastImage.height;

            onload?.(e);
        };
    }

    get imageNumber() {
        return this.images.length;
    }

    getImage(index) {
        return this.images[index];
    }
}

class Room {
    static now = null;

    constructor() {
    }

    update() {
    }

    draw() {
    }

    drawAfter() {
    }

    static open(cls) {
        GameObject.destroyAll();
        ObjectName = {};
        this.now = new cls();
    }
}

class TitleRoom extends Room {
    constructor() {
        super();

        Game.stageSettings = [{
            music: "stage 1.ogg",
            brick: Sprite.stage1_brick,
            platform: Sprite.stage1_platform,
            needleU: Sprite.stage1_needleU,
            needleD: Sprite.stage1_needleD,
            needleL: Sprite.stage1_needleL,
            needleR: Sprite.stage1_needleR,
            miniNeedleU: Sprite.stage1_miniNeedleU,
            miniNeedleD: Sprite.stage1_miniNeedleD,
            miniNeedleL: Sprite.stage1_miniNeedleL,
            miniNeedleR: Sprite.stage1_miniNeedleR,
            backTile: GameImage.stage1_backTile,
            startAlpha: 0.25,
            drawBackFun() {
                ctx.drawImage(GameImage.stage1_back, 0, 0, gameWidth, gameHeight);
            }
        }, {
            music: "stage 2.ogg",
            brick: Sprite.stage2_brick,
            platform: Sprite.stage2_platform,
            needleU: Sprite.stage2_needleU,
            needleD: Sprite.stage2_needleD,
            needleL: Sprite.stage2_needleL,
            needleR: Sprite.stage2_needleR,
            miniNeedleU: Sprite.stage2_miniNeedleU,
            miniNeedleD: Sprite.stage2_miniNeedleD,
            miniNeedleL: Sprite.stage2_miniNeedleL,
            miniNeedleR: Sprite.stage2_miniNeedleR,
            backTile: GameImage.stage2_backTile,
            startAlpha: 0,
            drawBackFun() {
                ctx.fillRect(0, 0, gameWidth, gameHeight);
                for (let i = 0; i != 4; ++i) {
                    ctx.drawImage(GameImage.stage2_back, 256 * i, 192);
                }
            }
        }];

        this.backX = -32;
        this.backY = -32;

        GameObject.deleteAllLayer();
        GameObject.createLayer("title");

        GameObject.create("title", new Tile(80, 20, GameImage.title));
        GameObject.create("title", new FileButton(128, 352, 0));
        GameObject.create("title", new FileButton(400, 352, 1));
        GameObject.create("title", new FileButton(672, 352, 2));

        playMusic("title.ogg");
    }

    update() {
        this.backX += 0.8333333333333334;
        this.backY += 0.8333333333333334;
        if (this.backX >= 0) {
            this.backX -= 32;
            this.backY -= 32;
        }
    }

    draw() {
        for (let i = 0, drawX = this.backX; i != 26; ++i, drawX += 32) {
            for (let j = 0, drawY = this.backY; j != 20; ++j, drawY += 32) {
                ctx.drawImage(GameImage.titleBack, drawX, drawY);
            }
        }

        if (Game.fileIndex != -1) {
            if (Game.screenShot != null) {
                ctx.drawImage(Game.screenShot, 330, 256, 400, 300);
            } else {
                ctx.font = "bold 30px Arial";
                ctx.textAlign = "center";
                ctx.fillText("No Screenshot", 576, 341);

                ctx.textAlign = "left";
            }
        }
    }
}

class LevelRoom extends Room {
    constructor() {
        super();

        // 创建前景画布
        Game.screenAlpha = Game.stageSetting.startAlpha;
        if (Game.foreCanvas == null) {
            Game.foreCanvas = document.createElement("canvas");
            Game.foreCanvas.width = gameWidth;
            Game.foreCanvas.height = gameHeight;
            Game.foreContext = Game.foreCanvas.getContext("2d");
        }

        // 创建层和对象
        const layers = Game.levels[Game.level].layers;
        for (let i = layers.length - 1; i != -1; --i) {
            const layer = layers[i];
            GameObject.createLayer(layer.name);
            for (const object of layer.objects) {
                const o = GameObject.create(layer.name, new globalThis[object.name](object.x, object.y));
                if (object.hasOwnProperty("properties") && object.properties.length != 0) {
                    o.applyProperties(object.properties);
                }
                if (object.hasOwnProperty("objectName") && object.objectName !== "") {
                    ObjectName[object.objectName] = o;
                }
            }
        }

        playMusic(Game.stageSetting.music);
    }

    update() {
        const now = Date.now();
        Game.time += now - Game.now;
        Game.now = now;

        if (Keyboard.isPressed("Escape")) {
            Game.saveDeathTime();
            Game.saveScreen();
            Game.reset();
            removeButton();
            Room.open(TitleRoom);
        }
        if (Keyboard.isCharPressed("R")) {
            Game.saveDeathTime();
            Game.load();
        }
    }

    draw() {
        Game.stageSetting.drawBackFun();
    }

    drawAfter() {
        Game.foreContext.clearRect(0, 0, Game.foreCanvas.width, Game.foreCanvas.height);
        
        ctx = Game.foreContext;
        for (const light of GameObject.objectsOf(Light)) {
            drawSprite(Sprite.lightRay, 0, light.x, light.y);
        }
        for (const saveLight of GameObject.objectsOf(SaveLight)) {
            drawSpriteExt(Sprite.lightRing, 0, saveLight.x + 16, saveLight.y + 16, 0.7, 0.7, 0, 1);
        }
        ctx = mainContext;
        Game.foreContext.globalCompositeOperation = "source-out";
        Game.foreContext.globalAlpha = Game.screenAlpha;
        Game.foreContext.fillRect(0, 0, Game.foreCanvas.width, Game.foreCanvas.height);
        Game.foreContext.globalCompositeOperation = "source-over";
        Game.foreContext.globalAlpha = 1;

        ctx.drawImage(Game.foreCanvas, 0, 0);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Tahoma";
        ctx.fillText("Floor", 35, 11);

        ctx.fillStyle = "#00000080";
        ctx.fillRect(40, 40, 50, 50);
        ctx.fillStyle = "#ffffffff";
        ctx.textAlign = "center";
        ctx.fillText((Game.level + 1).toString(), 65, 56);
        ctx.strokeStyle = "#ffffff80";
        ctx.strokeRect(40.5, 40.5, 49, 49);

        ctx.fillStyle = "#000000ff";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#ffffffff";
    }
}

class TestRoom extends Room {
    constructor() {
        super();

        GameObject.layers.clear();
        GameObject.layers.set("killer", []);
        GameObject.layers.set("brick", []);
        GameObject.layers.set("kid", []);

        GameObject.create("killer", new Fruit(80, 32));
        {
            const fuck = new Platform(96, 528);
            fuck.hspeed = 1.6;
            GameObject.create("brick", fuck);
        }
        {
            const fuck = new Platform(64, 160);
            fuck.vspeed = 1.6;
            GameObject.create("brick", fuck);
        }
        GameObject.create("brick", new Brick(0, 64));
        GameObject.create("brick", new Brick(64, 64));
        GameObject.create("brick", new Brick(128, 64));
        GameObject.create("brick", new Brick(64, 128));
        GameObject.create("brick", new Brick(64, 512));
        GameObject.create("brick", new Brick(320, 512));
        GameObject.create("kid", new Kid(17, 23));
    }

    update() {
    }

    draw() {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    }
}

class FinalRoom extends Room {
    constructor() {
        super();

        Sound.stop(Game.nowMusicBuffer);
        ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "36px 微软雅黑";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("赢", 400, 304);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
    }
}

class GameObject {
    /**
     * @type {Map<string, GameObject[]>}
     */
    static layers = new Map();
    static nowLayer = "";

    constructor() {
        this.readyDestroy = false;
    }

    destroy() {
        this.readyDestroy = true;
    }

    update() {

    }

    draw() {

    }

    collideObject(x, y, obj) {
        const otherHitbox = obj.getHitbox(Math.round(obj.x), Math.round(obj.y));
        const otherRect = otherHitbox.rect;
        const hitbox = this.getHitbox(Math.round(x), Math.round(y));
        const rect = hitbox.rect;

        if (otherHitbox.type == HITBOX_RECT) {
            if (rect[0] < otherRect[1] && rect[1] > otherRect[0] && rect[2] < otherRect[3] && rect[3] > otherRect[2]) {
                return true;
            }
        } else if (otherHitbox.type == HITBOX_PREC) {
            if (rect[0] < otherRect[1] && rect[1] > otherRect[0] && rect[2] < otherRect[3] && rect[3] > otherRect[2]) {
                const overlappedU = rect[0] > otherRect[0] ? rect[0] : otherRect[0];
                const overlappedD = rect[1] < otherRect[1] ? rect[1] : otherRect[1];
                const overlappedL = rect[2] > otherRect[2] ? rect[2] : otherRect[2];
                const overlappedR = rect[3] < otherRect[3] ? rect[3] : otherRect[3];
                for (let i = overlappedU; i < overlappedD; ++i) {
                    for (let j = overlappedL; j < overlappedR; ++j) {
                        if (obj.collidePoint(j, i)) {
                            return true;
                        }
                    }
                }
            }
        } else if (otherHitbox.type == HITBOX_ROTATED_RECT) {
            const otherTLX = obj.x + (otherRect[2] - obj.x) * Math.cos(otherHitbox.angle) - (obj.y - otherRect[0]) * Math.sin(otherHitbox.angle);
            const otherTLY = obj.y - (obj.y - otherRect[0]) * Math.cos(otherHitbox.angle) - (otherRect[2] - obj.x) * Math.sin(otherHitbox.angle);
            const otherTRX = obj.x + (otherRect[3] - obj.x) * Math.cos(otherHitbox.angle) - (obj.y - otherRect[0]) * Math.sin(otherHitbox.angle);
            const otherTRY = obj.y - (obj.y - otherRect[0]) * Math.cos(otherHitbox.angle) - (otherRect[3] - obj.x) * Math.sin(otherHitbox.angle);
            const otherBLX = obj.x + (otherRect[2] - obj.x) * Math.cos(otherHitbox.angle) - (obj.y - otherRect[1]) * Math.sin(otherHitbox.angle);
            const otherBLY = obj.y - (obj.y - otherRect[1]) * Math.cos(otherHitbox.angle) - (otherRect[2] - obj.x) * Math.sin(otherHitbox.angle);
            const otherBRX = obj.x + (otherRect[3] - obj.x) * Math.cos(otherHitbox.angle) - (obj.y - otherRect[1]) * Math.sin(otherHitbox.angle);
            const otherBRY = obj.y - (obj.y - otherRect[1]) * Math.cos(otherHitbox.angle) - (otherRect[3] - obj.x) * Math.sin(otherHitbox.angle);
            const otherMinX = Math.min(otherTLX, otherTRX, otherBLX, otherBRX);
            const otherMaxX = Math.max(otherTLX, otherTRX, otherBLX, otherBRX);
            const otherMinY = Math.min(otherTLY, otherTRY, otherBLY, otherBRY);
            const otherMaxY = Math.max(otherTLY, otherTRY, otherBLY, otherBRY);
            if (rect[3] <= otherMinX || rect[2] >= otherMaxX || rect[1] <= otherMinY || rect[0] >= otherMaxY) {
                return false;
            }

            const tlx = obj.x + (rect[2] - obj.x) * Math.cos(-otherHitbox.angle) - (obj.y - rect[0]) * Math.sin(-otherHitbox.angle);
            const tly = obj.y - (obj.y - rect[0]) * Math.cos(-otherHitbox.angle) - (rect[2] - obj.x) * Math.sin(-otherHitbox.angle);
            const trx = obj.x + (rect[3] - obj.x) * Math.cos(-otherHitbox.angle) - (obj.y - rect[0]) * Math.sin(-otherHitbox.angle);
            const _try = obj.y - (obj.y - rect[0]) * Math.cos(-otherHitbox.angle) - (rect[3] - obj.x) * Math.sin(-otherHitbox.angle);
            const blx = obj.x + (rect[2] - obj.x) * Math.cos(-otherHitbox.angle) - (obj.y - rect[1]) * Math.sin(-otherHitbox.angle);
            const bly = obj.y - (obj.y - rect[1]) * Math.cos(-otherHitbox.angle) - (rect[2] - obj.x) * Math.sin(-otherHitbox.angle);
            const brx = obj.x + (rect[3] - obj.x) * Math.cos(-otherHitbox.angle) - (obj.y - rect[1]) * Math.sin(-otherHitbox.angle);
            const bry = obj.y - (obj.y - rect[1]) * Math.cos(-otherHitbox.angle) - (rect[3] - obj.x) * Math.sin(-otherHitbox.angle);
            const minX = Math.min(tlx, trx, blx, brx);
            const maxX = Math.max(tlx, trx, blx, brx);
            const minY = Math.min(tly, _try, bly, bry);
            const maxY = Math.max(tly, _try, bly, bry);
            if (otherRect[3] <= minX || otherRect[2] >= maxX || otherRect[1] <= minY || otherRect[0] >= maxY) {
                return false;
            }

            return true;
        }

        return false;
    }

    collide(x, y, cls) {
        for (const obj of GameObject.objectsOf(cls)) {
            if (this.collideObject(x, y, obj)) {
                return true;
            }
        }

        return false;
    }

    moveContact(dir, maxdist, cls) {
        let dist = 0;
        _outer: {
            while (true) {
                for (const obj of GameObject.objectsOf(cls)) {
                    if (this.collideObject(this.x, this.y, obj)) {
                        if (dist != 0) {
                            if (dir == 0) {
                                --this.x;
                            } else if (dir == 90) {
                                ++this.y;
                            } else if (dir == 180) {
                                ++this.x;
                            } else if (dir == 270) {
                                --this.y;
                            }
                        }
                        break _outer;
                    }
                }

                if (dist >= maxdist) {
                    break;
                }

                if (dir == 0) {
                    ++this.x;
                } else if (dir == 90) {
                    --this.y;
                } else if (dir == 180) {
                    --this.x;
                } else if (dir == 270) {
                    ++this.y;
                }
                ++dist;
            }
        }
    }

    static create(layer, obj) {
        this.layers.get(layer).push(obj);
        return obj;
    }

    static updateObjects() {
        for (const [name, objects] of this.layers.entries()) {
            this.nowLayer = name;
            for (let i = objects.length - 1; i != -1; --i) {
                const obj = objects[i];
                if (obj.readyDestroy) {
                    objects.splice(i, 1);
                    continue;
                }
                obj.update();
                if (obj.readyDestroy) {
                    objects.splice(i, 1);
                }
            }
        }
    }

    static drawObjects() {
        for (const objects of this.layers.values()) {
            for (const obj of objects) {
                obj.draw();
            }
        }
    }

    static destroyClass(cls) {
        for (const obj of this.objectsOf(cls)) {
            obj.destroy();
        }
    }

    static destroyAll() {
        this.layers.clear();
    }

    static *objectsOf(cls) {
        for (const objects of this.layers.values()) {
            for (const obj of objects) {
                if (obj instanceof cls) {
                    yield obj;
                }
            }
        }
    }

    static createLayer(name) {
        this.layers.set(name, []);
    }

    static deleteAllLayer() {
        this.layers.clear();
    }
}

globalThis.BackTile = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.drawImage(Game.stageSetting.backTile, this.x, this.y);
    }
};

globalThis.Tile = class extends GameObject {
    constructor(x, y, image) {
        super();
        this.x = x;
        this.y = y;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }

    applyProperties(properties) {
        this.image = GameImage[properties[0]];
    }
};

class Kid extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.scaleX = 1;
        this.scaleY = 1;

        this.hspeed = 0;
        this.vspeed = 0;
        this.gravity = 0.2777777777777778;

        this.runSpeed = 2.5;
        this.jumpSpeed = -6.75;
        this.airJumpSpeed = -5.5;
        this.maxFallSpeed = 7.833333333333333;

        this.onPlatform = false;

        this.jumpChance = 1;
        this.maxJumpChance = 1;

        this.sprite = Sprite.kidStand;
        this.imageSpeed = 0.16666666666666666;
        this.imageIndex = 0;
    }

    update() {
        this.vspeed += this.gravity;

        let runDirection;
        if (Keyboard.isPressed("ArrowLeft") || Keyboard.isHeld("ArrowLeft")) {
            runDirection = -1;
        } else if (Keyboard.isPressed("ArrowRight") || Keyboard.isHeld("ArrowRight")) {
            runDirection = 1;
        } else {
            runDirection = 0;
        }

        this.hspeed = this.runSpeed * runDirection;

        if (this.onPlatform) {
            if (!this.collide(this.x, this.y + 4 * this.scaleY, Platform)) {
                this.onPlatform = false;
            }
        }

        if (Keyboard.isPressed("Shift")) {
            // 跳
            if (this.collide(this.x, this.y + this.scaleY, Brick) || this.onPlatform || this.collide(this.x, this.y, Platform)) {
                // 一段
                this.vspeed = this.jumpSpeed;
                this.jumpChance = this.maxJumpChance;
                Sound.play(Sound.get("audio/jump.wav"));
            } else if (this.jumpChance > 0) {
                // 二段
                --this.jumpChance;
                this.vspeed = this.airJumpSpeed;
                Sound.play(Sound.get("audio/air jump.wav"));
            }
        }
        if (Keyboard.isReleased("Shift")) {
            if (this.vspeed * this.scaleY < 0) {
                this.vspeed *= 0.45;
            }
        }
        if (Keyboard.isPressed(" ")) {
            this.reverse();
        }

        // 截断下落速度
        if (this.vspeed * this.scaleY > this.maxFallSpeed) {
            this.vspeed = this.scaleY * this.maxFallSpeed;
        }

        // 处理与砖碰撞
        const xp = this.x;
        const yp = this.y;
        this.x += this.hspeed;
        this.y += this.vspeed;
        if (this.collide(this.x, this.y, Brick)) {
            this.x = xp;
            this.y = yp;
            if (this.collide(this.x + this.hspeed, this.y, Brick)) {
                if (this.hspeed >= 0) {
                    this.moveContact(0, this.hspeed, Brick);
                } else {
                    this.moveContact(180, -this.hspeed, Brick);
                }
                this.hspeed = 0;
            }
            if (this.collide(this.x, this.y + this.vspeed, Brick)) {
                if (this.vspeed >= 0) {
                    this.moveContact(270, this.vspeed, Brick);
                    if (this.scaleY > 0) {
                        this.jumpChance = this.maxJumpChance;
                    }
                } else {
                    this.moveContact(90, -this.vspeed, Brick);
                    if (this.scaleY < 0) {
                        this.jumpChance = this.maxJumpChance;
                    }
                }
                this.vspeed = 0;
            }
            if (this.collide(this.x + this.hspeed, this.y + this.vspeed, Brick)) {
                this.hspeed = 0;
            }

            this.x += this.hspeed;
            this.y += this.vspeed;
        }

        // 处理与平板碰撞
        for (const other of GameObject.objectsOf(Platform)) {
            if (this.collideObject(this.x, this.y, other)) {
                const otherHitbox = other.getHitbox(other.x, other.y).rect;
                if (this.scaleY > 0) {
                    if (this.y - this.vspeed / 2 <= otherHitbox[0]) {
                        // 上板
                        const yOnPlatform = otherHitbox[0] - this.getHitbox(this.x, this.y).rect[5];
                        if (!this.collide(this.x, yOnPlatform, Brick)) {
                            this.y = yOnPlatform;
                            this.vspeed = other.vspeed > 0 ? other.vspeed : 0;
                        }

                        this.onPlatform = true;
                        this.jumpChance = this.maxJumpChance;
                    }
                } else {
                    if (this.y - this.vspeed / 2 >= otherHitbox[1] - 1) {
                        const yOnPlatform = otherHitbox[1] + this.getHitbox(this.x, this.y).rect[4];
                        if (!this.collide(this.x, yOnPlatform, Brick)) {
                            this.y = yOnPlatform;
                            this.vspeed = other.vspeed < 0 ? other.vspeed : 0;
                        }

                        this.onPlatform = true;
                        this.jumpChance = this.maxJumpChance;
                    }
                }
            }
        }

        // 处理与存档碰撞
        for (const save of GameObject.objectsOf(Save)) {
            if (this.collideObject(this.x, this.y, save)) {
                if (save.enableSave()) {
                    save.save(this);
                }
            }
        }

        // 处理进入灯存档范围
        if (Game.stage == 1) {
            let meetSome = false;
            for (const saveLight of GameObject.objectsOf(SaveLight)) {
                const distX = saveLight.x - this.x;
                const distY = saveLight.y - this.y;
                const dist = Math.sqrt(distX * distX + distY * distY);
                if (dist <= 72) {
                    saveLight.active = true;
                    meetSome = true;
                } else {
                    saveLight.active = false;
                }
            }
            if (meetSome) {
                Game.screenAlpha -= 0.08333333333333333;
                if (Game.screenAlpha < 0) {
                    Game.screenAlpha = 0;
                }
            } else {
                if (Game.fadeTimer == 0) {
                    if (Game.screenAlpha > 0.5) {
                        Game.fadeTimer = 2;
                    } else {
                        Game.fadeTimer = 1;
                    }
                    Game.screenAlpha += 0.008333333333333333;
                    if (Game.screenAlpha > 1) {
                        Game.screenAlpha = 1;
                    }
                } else {
                    --Game.fadeTimer;
                }
            }
        }

        // 处理与开关碰撞
        for (const mySwitch of GameObject.objectsOf(Switch)) {
            if (this.collideObject(this.x, this.y, mySwitch)) {
                if (mySwitch.imageIndex == 0) {
                    mySwitch.imageIndex = 1;
                    globalThis[mySwitch.onTrigger]();
                    Sound.play(Sound.get("audio/switch.wav"));
                }
            }
        }

        // 处理与门碰撞
        for (const teleporter of GameObject.objectsOf(Teleporter)) {
            if (this.collideObject(this.x, this.y, teleporter)) {
                Sound.play(Sound.get("audio/teleport.wav"));
                ++Game.level;
                if (Game.level != 40) {
                    if (Game.level % 20 == 0) {
                        ++Game.stage;
                    }
                    Room.open(LevelRoom);
                } else {
                    Room.open(FinalRoom);
                }
                return;
            }
        }

        // 处理与致死物碰撞
        if (this.collide(this.x, this.y, Killer)) {
            ++Game.death;
            Sound.play(Sound.get("audio/die.wav"));
            this.destroy();
        }

        // 改变样貌
        if (runDirection != 0) {
            this.scaleX = runDirection;
        }
        if (this.collide(this.x, this.y + this.scaleY, Brick) || this.onPlatform) {
            if (runDirection != 0) {
                this.sprite = Sprite.kidRun;
                this.imageSpeed = 0.4166666666666667;
            } else {
                this.sprite = Sprite.kidStand;
                this.imageSpeed = 0.16666666666666666;
            }
        } else {
            if (this.vspeed * this.scaleY > 0) {
                this.sprite = Sprite.kidFall;
                this.imageSpeed = 0.16666666666666666;
            } else {
                this.sprite = Sprite.kidJump;
                this.imageSpeed = 0.16666666666666666;
            }
        }

        // 动画
        this.imageIndex += this.imageSpeed;
        if (this.imageIndex >= this.sprite.imageNumber) {
            this.imageIndex -= this.sprite.imageNumber * Math.floor(this.imageIndex / this.sprite.imageNumber);
        }
    }

    draw() {
        drawSpriteExt(this.sprite, Math.floor(this.imageIndex), Math.round(this.x) + (this.scaleX > 0 ? 0 : 1), Math.round(this.y), this.scaleX, this.scaleY, 0, 1);
    }

    getHitbox(x, y) {
        let rect;
        if (this.scaleY > 0) {
            rect = [y - 12, y + 9, x - 5, x + 6, 12, 9, 5, 6];
        } else {
            rect = [y - 9, y + 12, x - 5, x + 6, 9, 12, 5, 6];
        }
        return {
            type: HITBOX_RECT,
            rect: rect
        };
    }

    reverse() {
        this.y -= 3 * this.scaleY;
        this.vspeed = 0;

        this.scaleY = -this.scaleY;
        this.gravity = -this.gravity;
        this.jumpSpeed = -this.jumpSpeed;
        this.airJumpSpeed = -this.airJumpSpeed;
    }
};

class DestroyEffect extends GameObject {
    constructor(x, y, image) {
        super();
        this.x = x;
        this.y = y;
        this.sprite = image;
        this.hspeed = choose(0.8333333333333334, 1.6666666666666667) * choose(-1, 1);
        this.vspeed = -2.5;
        this.rotateSpeed = choose(-0.04363323129985824, 0.04363323129985824);
        this.angle = 0;
        this.alpha = 1;
        this.gravity = 0.1388888888888889;
    }

    update() {
        this.angle += this.rotateSpeed;
        this.alpha -= 0.016666666666666666;
        if (this.alpha <= 0) {
            this.destroy();
        }
        this.vspeed += this.gravity;
        this.x += this.hspeed;
        this.y += this.vspeed;
    }

    draw() {
        drawSpriteExt(this.sprite, 0, this.x, this.y, 1, 1, this.angle, this.alpha);
    }
}

class Executer extends GameObject {
    constructor() {
        super();
        this.now = 0;
        this.nextMomentIndex = 0;
        this.moments = [];
    }

    update() {
        if (this.now == this.moments[this.nextMomentIndex].moment) {
            this.moments[this.nextMomentIndex].fun();
            ++this.nextMomentIndex;
            if (this.nextMomentIndex == this.moments.length) {
                this.destroy();
            }
        }
        ++this.now;
    }

    addMoment(moment, fun) {
        this.moments.push({
            moment: moment,
            fun: fun
        });
    }
}

globalThis.Brick = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    draw() {
        drawSprite(Game.stageSetting.brick, 0, this.x, this.y);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_RECT,
            rect: [y, y + 32, x, x + 32, 0, 32, 0, 32]
        };
    }
};

globalThis.MiniBrick = class extends Brick {
    constructor(x, y) {
        super(x, y);
    }

    draw() {
        drawSpriteExt(Game.stageSetting.brick, 0, this.x, this.y, 0.5, 0.5, 0, 1);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_RECT,
            rect: [y, y + 16, x, x + 16, 0, 16, 0, 16]
        };
    }
}

globalThis.Platform = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;

        this.hspeed = 0;
        this.vspeed = 0;
    }

    update() {
        if (this.hspeed != 0 || this.vspeed != 0) {
            // 碰砖反弹
            if (this.collide(this.x + this.hspeed, this.y, Brick)) {
                this.hspeed = -this.hspeed;
            }
            if (this.collide(this.x, this.y + this.vspeed, Brick)) {
                this.vspeed = -this.vspeed;
            }

            for (const kid of GameObject.objectsOf(Kid)) {
                // 碰人带动
                if (this.collideObject(this.x, this.y - 2 * kid.scaleY, kid)) {
                    if (!kid.collide(kid.x, kid.y + this.vspeed, Brick)) {
                        kid.y += this.vspeed;
                    }
                    if (!kid.collide(kid.x + this.hspeed, kid.y, Brick)) {
                        kid.x += this.hspeed;
                    }
                }
            }

            this.x += this.hspeed;
            this.y += this.vspeed;
        }
    }

    draw() {
        drawSprite(Game.stageSetting.platform, 0, this.x, this.y);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_RECT,
            rect: [y, y + 16, x, x + 32, 0, 32, 0, 16]
        };
    }

    applyProperties(properties) {
        this.hspeed = properties[0];
        this.vspeed = properties[1];
    }
};

globalThis.Killer = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
};

globalThis.Needle = class extends Killer {
    constructor(x, y, sprite, hitboxBitmap) {
        super(x, y);
        this.sprite = sprite;
        this.hitboxBitmap = hitboxBitmap;
    }

    draw() {
        drawSprite(this.sprite, 0, this.x, this.y);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_PREC,
            rect: [y, y + this.sprite.height, x, x + this.sprite.width],
        };
    }

    collidePoint(x, y) {
        return this.hitboxBitmap[this.sprite.width * (y - Math.round(this.y)) + x - Math.round(this.x)];
    }
};

globalThis.NeedleU = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.needleU, HitboxBitmap.needleU);
    }
};

globalThis.NeedleD = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.needleD, HitboxBitmap.needleD);
    }
};

globalThis.NeedleL = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.needleL, HitboxBitmap.needleL);
    }
};

globalThis.NeedleR = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.needleR, HitboxBitmap.needleR);
    }
};

globalThis.MiniNeedleU = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.miniNeedleU, HitboxBitmap.miniNeedleU);
    }
};

globalThis.MiniNeedleD = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.miniNeedleD, HitboxBitmap.miniNeedleD);
    }
};

globalThis.MiniNeedleL = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.miniNeedleL, HitboxBitmap.miniNeedleL);
    }
};

globalThis.MiniNeedleR = class extends Needle {
    constructor(x, y) {
        super(x, y, Game.stageSetting.miniNeedleR, HitboxBitmap.miniNeedleR);
    }
};

globalThis.KillerBrick = class extends Killer {
    constructor(x, y) {
        super(x, y);
    }

    draw() {
        drawSprite(Sprite.killerBrick, 0, this.x, this.y);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_RECT,
            rect: [y, y + 32, x, x + 32, 0, 32, 0, 32]
        };
    }
};

globalThis.Fruit = class extends Killer {
    constructor(x, y) {
        super(x, y);
        this.imageIndex = 0;
    }

    update() {
        this.imageIndex += 0.05555555555555555;
        if (this.imageIndex >= 2) {
            this.imageIndex -= 2;
        }
    }

    draw() {
        drawSprite(Sprite.fruit, Math.floor(this.imageIndex), this.x, this.y);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_PREC,
            rect: [y - 12, y + 12, x - 10, x + 11, 12, 12, 10, 11]
        };
    }

    collidePoint(x, y) {
        const bitmap = HitboxBitmap.fruit[Math.floor(this.imageIndex)];
        return bitmap[21 * (y - this.y + 12) + x - this.x + 10];
    }
};

globalThis.Button = class extends GameObject {
    constructor(x, y, text, onclick = null) {
        super();

        this.x = x;
        this.y = y;
        this.text = text;
        this.onclick = onclick;
        this.mouseIn = false;
    }

    update() {
        this.mouseIn = Mouse.x >= this.x && Mouse.x < this.x + 200 && Mouse.y >= this.y && Mouse.y < this.y + 50;
        if (this.mouseIn && Mouse.isReleased(0)) {
            this.onclick?.();
        }
    }

    draw() {
        drawSprite(Sprite.button, this.mouseIn ? 1 : 0, this.x, this.y);

        ctx.font = "bold 24px Tahoma";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.x + 100, this.y + 17);
        
        ctx.textAlign = "left";
    }
};

globalThis.FileButton = class extends GameObject {
    constructor(x, y, index) {
        super();

        this.x = x;
        this.y = y;
        this.index = index;
        this.mouseIn = false;

        this.saveData = null;
        this.timeStr = "";
        const saveDataStr = localStorage.getItem(`saveData${index}`);
        if (saveDataStr !== null) {
            this.saveData = JSON.parse(saveDataStr);
            let time = this.saveData.time;
            const hour = Math.floor(time / 3600000);
            time -= 3600000 * hour;
            const minute = Math.floor(time / 60000);
            time -= 60000 * minute;
            const second = Math.floor(time / 1000);
            time -= 1000 * second;
            const centiSecond = Math.floor(time / 10);
            this.timeStr = `${hour}:${minute}:${second}.${centiSecond}`;
        }
    }

    update() {
        this.mouseIn = Mouse.x >= this.x - 100 && Mouse.x < this.x + 100 && Mouse.y >= this.y - 100 && Mouse.y < this.y + 100;
        if (this.mouseIn && Mouse.isReleased(0)) {
            Game.fileIndex = this.index;
            Game.loadScreen();

            GameObject.create("title", new Button(80, 256, "New Game", () => {
                if (localStorage.getItem(`saveData${Game.fileIndex}`) === null || confirm("覆盖存档？")) {
                    Game.now = Date.now();
                    createButton();
                    Room.open(LevelRoom);
                }
            }));
            GameObject.create("title", new Button(80, 352, "Continue", () => {
                Game.now = Date.now();
                Game.saveData = JSON.parse(localStorage.getItem(`saveData${Game.fileIndex}`));
                createButton();
                Game.load();
            }));
            GameObject.create("title", new Button(80, 448, "Back", () => {
                Game.fileIndex = -1;
                Room.open(TitleRoom);
            }));
            GameObject.destroyClass(FileButton);
        }
    }

    draw() {
        drawSprite(Sprite.fileButton, this.mouseIn ? 1 : 0, this.x, this.y);

        ctx.fillRect(this.x - 80, this.y - 45, 161, 6);
        ctx.font = "bold 36px Tahoma";
        ctx.textAlign = "center";
        ctx.fillText(`File${this.index + 1}`, this.x, this.y - 83);

        if (this.saveData === null) {
            ctx.font = "30px Arial";
            ctx.fillText("No Data", this.x, this.y - 2);
        } else {
            ctx.font = "bold 24px Tahoma";
            ctx.fillText(`Floor ${this.saveData.level + 1}`, this.x, this.y - 29);

            ctx.font = "20px Arial";
            ctx.fillText(`${this.saveData.death} Deaths`, this.x, this.y + 16);
            ctx.fillText(`Time: ${this.timeStr}`, this.x, this.y + 46);
        }

        ctx.textAlign = "left";
    }
};

globalThis.KidCreator = class extends GameObject {
    constructor(x, y) {
        super();

        let kidX;
        let kidY;
        let scaleX;
        if (Game.kidTeleported) {
            Game.kidTeleported = false;
            kidX = Game.kidTeleportX;
            kidY = Game.kidTeleportY;
            scaleX = Game.kidTeleportScaleX;
        } else {
            kidX = x + 17;
            kidY = y + 23;
            scaleX = 1;
        }
        const kid = GameObject.create("kid", new Kid(kidX, kidY));
        kid.scaleX = scaleX;
        this.destroy();
    }
}

globalThis.Save = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.progress = 1;
        this.sprite = Sprite.save;
        this.minAlpha = 0.05;
        this.imageIndex = 0;
        this.recoverTime = -1;
        this.alpha = 1;
        this.targetAlpha = 1;
    }

    update() {
        if (this.recoverTime >= 0) {
            --this.recoverTime;
            if (this.recoverTime == 0) {
                this.targetAlpha = 1;
            }
        }

        if (this.alpha > this.targetAlpha) {
            this.alpha -= 0.06666666666666667;
            if (this.alpha <= this.targetAlpha) {
                this.alpha = this.targetAlpha;
            }
        } else if (this.alpha < this.targetAlpha) {
            this.alpha += 0.06666666666666667;
            if (this.alpha >= this.targetAlpha) {
                this.alpha = this.targetAlpha;
                this.imageIndex = 0;
            }
        }
    }

    draw() {
        drawSpriteExt(this.sprite, this.imageIndex, this.x, this.y, 1, 1, 0, this.alpha);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_RECT,
            rect: [y, y + 32, x, x + 32, 0, 32, 0, 32]
        };
    }

    enableSave() {
        return this.imageIndex == 0;
    }

    save(kid) {
        this.imageIndex = 1;
        this.recoverTime = 72;
        this.targetAlpha = this.minAlpha;

        Game.saveData.kidX = kid.x;
        Game.saveData.kidY = kid.y;
        Game.saveData.kidScaleX = kid.scaleX;
        Game.saveData.level = Game.level;
        Game.saveData.stage = Game.stage;
        localStorage.setItem(`saveData${Game.fileIndex}`, JSON.stringify(Game.saveData));
    }
};

globalThis.SaveLight = class extends Save {
    constructor(x, y) {
        super(x, y);
        this.sprite = Sprite.saveLight;
        this.minAlpha = 0.5;
        this.active = false;
        this.starAngle = 0;
    }

    update() {
        super.update();
        this.starAngle -= 0.02908882086657216;
    }

    draw() {
        if (this.active) {
            drawSpriteExt(Sprite.saveLightStar, 0, this.x + 16, this.y + 16, 0.3, 0.3, this.starAngle, 1);
            drawSpriteExt(Sprite.saveLightStar, 0, this.x + 16, this.y + 16, 0.4, 0.4, this.starAngle - 0.7853981633974483, 1);
        }
        super.draw();
    }
};

globalThis.Light = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    draw() {
        drawSprite(Sprite.light, 0, this.x, this.y);
    }
};

globalThis.Teleporter = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.angle = 0;
    }

    update() {
        this.angle -= 0.01454441043328608;
        if (this.angle <= -2 * Math.PI) {
            this.angle += 2 * Math.PI;
        }
    }

    draw() {
        drawSpriteExt(Sprite.teleporter, 0, this.x, this.y, 1, 1, this.angle, 1);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_ROTATED_RECT,
            rect: [y - 16, y + 16, x - 16, x + 16],
            angle: -this.angle
        };
    }
};

globalThis.Switch = class extends GameObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.onTrigger = "";
        this.imageIndex = 0;
    }

    draw() {
        drawSprite(Sprite.mySwitch, this.imageIndex, this.x, this.y);
    }

    getHitbox(x, y) {
        return {
            type: HITBOX_RECT,
            rect: [y - 12, y + 12, x - 12, x + 12, 12, 12, 12, 12]
        };
    }

    applyProperties(properties) {
        this.onTrigger = properties[0];
    }
}

const Keyboard = {
    /**
     * @type {Map<string, number>}
     * key: 键盘按键字符串
     * value: 状态值，3位二进制数，从高到低依次表示：是否被按下，是否被按住，是否被松开
     */
    keyMap: new Map(),

    update() {
        for (const key of this.keyMap.keys()) {
            const state = this.keyMap.get(key);
            if ((state & 0b100) > 0 && (state & 0b1) == 0) {
                this.keyMap.set(key, 0b10);
            } else if ((state & 0b100) == 0 && (state & 0b1) > 0) {
                this.keyMap.set(key, 0);
            } else {
                this.keyMap.set(key, state & 0b10);
            }
        }
    },

    press(key) {
        if (this.keyMap.has(key)) {
            const state = this.keyMap.get(key);
            if ((state & 0b10) == 0) {
                this.keyMap.set(key, state | 0b100);
            }
        } else {
            this.keyMap.set(key, 0b100);
        }
    },

    release(key) {
        const state = this.keyMap.get(key);
        this.keyMap.set(key, state | 0b1);
    },

    isPressed(key) {
        if (this.keyMap.has(key)) {
            return (this.keyMap.get(key) & 0b100) > 0;
        }
        return false;
    },

    isHeld(key) {
        if (this.keyMap.has(key)) {
            return (this.keyMap.get(key) & 0b10) > 0;
        }
        return false;
    },

    isReleased(key) {
        if (this.keyMap.has(key)) {
            return (this.keyMap.get(key) & 0b1) > 0;
        }
        return false;
    },

    isCharPressed(ch) {
        if (this.keyMap.has(ch) && (this.keyMap.get(ch) & 0b100) > 0) {
            return true;
        }
        const code = ch.charCodeAt(0);
        const lowerChar = String.fromCharCode(code + 32);
        if (this.keyMap.has(lowerChar) && (this.keyMap.get(lowerChar) & 0b100) > 0) {
            return true;
        }
        return false;
    },

    isCharHeld(ch) {
        if (this.keyMap.has(ch) && (this.keyMap.get(ch) & 0b10) > 0) {
            return true;
        }
        const code = ch.charCodeAt(0);
        const lowerChar = String.fromCharCode(code + 32);
        if (this.keyMap.has(lowerChar) && (this.keyMap.get(lowerChar) & 0b10) > 0) {
            return true;
        }
        return false;
    },

    isCharReleased(ch) {
        if (this.keyMap.has(ch) && (this.keyMap.get(ch) & 0b1) > 0) {
            return true;
        }
        const code = ch.charCodeAt(0);
        const lowerChar = String.fromCharCode(code + 32);
        if (this.keyMap.has(lowerChar) && (this.keyMap.get(lowerChar) & 0b1) > 0) {
            return true;
        }
        return false;
    }
};

const Mouse = {
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
    /**
     * @type {number[]}
     * 3个元素，从左到右依次表示：鼠标左键、中键、右键
     * value: 状态值，3位二进制数，从高到低分别表示：是否被按下，是否被按住，是否被松开
     */
    buttons: [],

    pos(x, y) {
        this.x = x;
        this.y = y;
    },

    posPage(x, y) {
        this.pageX = x;
        this.pageY = y;
    },

    update() {
        for (const button of this.buttons) {
            const state = this.buttons[button];
            if ((state & 0b100) > 0 && (state & 0b1) == 0) {
                this.buttons[button] = 0b10;
            } else if ((state & 0b100) == 0 && (state & 0b1) > 0) {
                this.buttons[button] = 0;
            } else {
                this.buttons[button] &= 0b10;
            }
        }
    },

    press(button) {
        this.buttons[button] |= 0b100;
    },

    release(button) {
        this.buttons[button] |= 0b1;
    },

    isPressed(button) {
        return (this.buttons[button] & 0b100) > 0;
    },

    isHeld(button) {
        return (this.buttons[button] & 0b10) > 0;
    },

    isReleased(button) {
        return (this.buttons[button] & 0b1) > 0;
    }
};

document.onkeydown = e => {
    Keyboard.press(e.key);
};
document.onkeyup = e => {
    Keyboard.release(e.key);
};
mainCanvas.onmousedown = e => {
    Mouse.press(e.button);
};
mainCanvas.onmouseup = e => {
    Mouse.release(e.button);
};
mainCanvas.onmousemove = e => {
    Mouse.pos(e.offsetX, e.offsetY);
};
document.onmousemove = e => {
    Mouse.posPage(e.pageX, e.pageY);
};
window.onunload = e => {
    if (Room.now instanceof LevelRoom) {
        Game.saveDeathTime();
        Game.saveScreen();
    }
};

resize();
window.onresize = () => {
    resize();
};

for (let i = 0; i != 40; ++i) {
    const request = new XMLHttpRequest();
    request.open("GET", `level/level ${i}.txt`, false);
    request.send();
    Game.levels.push(JSON.parse(request.responseText));
}

// Sound.jump = new Audio("audio/jump.wav");
// Sound.airJump = new Audio("audio/air jump.wav");
Sound.load("audio/jump.wav");
Sound.load("audio/air jump.wav");
Sound.load("audio/die.wav");
Sound.load("audio/teleport.wav");
Sound.load("audio/switch.wav");
Sound.load("audio/break.wav");
Sound.load("audio/title.ogg");
Sound.load("audio/stage 1.ogg");
Sound.load("audio/stage 2.ogg");

GameImage.title = GameImage.load("image/title.png");
GameImage.titleBack = GameImage.load("image/title back.png");
GameImage.stage1_back = GameImage.load("image/stage 1/back.png");
GameImage.stage1_backTile = GameImage.load("image/stage 1/back tile.png");
GameImage.stage2_back = GameImage.load("image/stage 2/back.png");
GameImage.stage2_backTile = GameImage.load("image/stage 2/back tile.png");
GameImage.gateSign = GameImage.load("image/gate sign.png");
GameImage.diagonalSign = GameImage.load("image/diagonal sign.png");
GameImage.platformEdgeJumpSign = GameImage.load("image/platform edge jump sign.png");

Sprite.button = new Sprite(getImagePaths("button", 2));
Sprite.fileButton = new Sprite(getImagePaths("file button", 2), 100, 100);

Sprite.kidJump = new Sprite(getImagePaths("kid jump", 2), 17, 23);
Sprite.kidFall = new Sprite(getImagePaths("kid fall", 2), 17, 23);
Sprite.kidRun = new Sprite(getImagePaths("kid run", 4), 17, 23);
Sprite.kidSlide = new Sprite(getImagePaths("kid slide", 2), 25, 10);

Sprite.brick = new Sprite(["image/brick.png"]);
Sprite.platform = new Sprite(["image/platform.png"]);

Sprite.needleU = new Sprite(["image/needle up.png"]);
Sprite.needleD = new Sprite(["image/needle down.png"]);
Sprite.needleL = new Sprite(["image/needle left.png"]);
Sprite.needleR = new Sprite(["image/needle right.png"]);
Sprite.miniNeedleU = new Sprite(["image/mini needle up.png"]);
Sprite.miniNeedleD = new Sprite(["image/mini needle down.png"]);
Sprite.miniNeedleL = new Sprite(["image/mini needle left.png"]);
Sprite.miniNeedleR = new Sprite(["image/mini needle right.png"]);
Sprite.fruit = new Sprite(getImagePaths("fruit", 2), 10, 12);
Sprite.killerBrick = new Sprite(["image/killer brick.png"]);

Sprite.save = new Sprite(getImagePaths("save", 2));
Sprite.saveLight = new Sprite(getImagePaths("save light", 2));
Sprite.saveLightStar = new Sprite(["image/save light star.png"], 100, 100);
Sprite.lightRing = new Sprite(["image/light ring.png"], 128, 128);
Sprite.light = new Sprite(["image/light.png"], 7, 0);
Sprite.lightRay = new Sprite(["image/light ray.png"], 62, 0);
Sprite.teleporter = new Sprite(["image/teleporter.png"], 16, 16);
Sprite.mySwitch = new Sprite(getImagePaths("switch", 2), 16, 16);

Sprite.stage1_brick = new Sprite(["image/stage 1/brick.png"]);
Sprite.stage1_platform = new Sprite(["image/stage 1/platform.png"]);
Sprite.stage1_needleU = new Sprite(["image/stage 1/needle up.png"]);
Sprite.stage1_needleD = new Sprite(["image/stage 1/needle down.png"]);
Sprite.stage1_needleL = new Sprite(["image/stage 1/needle left.png"]);
Sprite.stage1_needleR = new Sprite(["image/stage 1/needle right.png"]);
Sprite.stage1_miniNeedleU = new Sprite(["image/stage 1/mini needle up.png"]);
Sprite.stage1_miniNeedleD = new Sprite(["image/stage 1/mini needle down.png"]);
Sprite.stage1_miniNeedleL = new Sprite(["image/stage 1/mini needle left.png"]);
Sprite.stage1_miniNeedleR = new Sprite(["image/stage 1/mini needle right.png"]);

Sprite.stage2_brick = new Sprite(["image/stage 2/brick.png"]);
Sprite.stage2_platform = new Sprite(["image/stage 2/platform.png"]);
Sprite.stage2_needleU = new Sprite(["image/stage 2/needle up.png"]);
Sprite.stage2_needleD = new Sprite(["image/stage 2/needle down.png"]);
Sprite.stage2_needleL = new Sprite(["image/stage 2/needle left.png"]);
Sprite.stage2_needleR = new Sprite(["image/stage 2/needle right.png"]);
Sprite.stage2_miniNeedleU = new Sprite(["image/stage 2/mini needle up.png"]);
Sprite.stage2_miniNeedleD = new Sprite(["image/stage 2/mini needle down.png"]);
Sprite.stage2_miniNeedleL = new Sprite(["image/stage 2/mini needle left.png"]);
Sprite.stage2_miniNeedleR = new Sprite(["image/stage 2/mini needle right.png"]);

Sprite.kidStand = new Sprite(getImagePaths("kid stand", 4), 17, 23, () => {
    Room.open(TitleRoom);
    mainLoop();
});


function mainLoop() {
    // 更新
    Room.now.update();
    GameObject.updateObjects();

    // 绘制
    Room.now.draw();
    GameObject.drawObjects();
    Room.now.drawAfter();

    Keyboard.update();
    Mouse.update();

    requestAnimationFrame(mainLoop);
}

function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // const windowWidth = window.screen.width;
    // const windowHeight = window.screen.width;

    // 改变画布位置
    if (windowWidth >= gameWidth && windowHeight >= gameHeight) {
        // 窗口尺寸够大，正常缩放
        mainCanvas.style.transform = "scale(1, 1)";
    } else {
        // 不够，缩放到最宽或最高
        const hRatio = windowWidth / gameWidth;
        const vRatio = windowHeight / gameHeight;
        if (hRatio > vRatio) {
            mainCanvas.style.transform = `scale(${vRatio}, ${vRatio})`;
        } else {
            mainCanvas.style.transform = `scale(${hRatio}, ${hRatio})`;
        }
    }

    mainCanvas.style.left = `${(windowWidth - mainCanvas.width) / 2}px`;
    mainCanvas.style.top = `${(windowHeight - mainCanvas.height) / 2}px`;

    // 改变按钮位置
    if (jumpButton !== null) {
        resizeButton();
    }
}

function createButton() {
    if (isMobile) {
        // 创建操作按钮
        jumpButton = document.createElement("div");
        jumpButton.className = "controlButton";
        jumpButton.style.backgroundImage = "url(\"image/jump button.png\")";
        jumpButton.ontouchstart = e => {
            Keyboard.press("Shift");
        };
        jumpButton.ontouchend = e => {
            Keyboard.release("Shift");
        };
        document.body.appendChild(jumpButton);

        retryButton = document.createElement("div");
        retryButton.className = "controlButton";
        retryButton.style.backgroundImage = "url(\"image/retry button.png\")";
        retryButton.ontouchstart = e => {
            Keyboard.press("R");
        };
        retryButton.ontouchend = e => {
            Keyboard.release("R");
        };
        document.body.appendChild(retryButton);

        leftButton = document.createElement("div");
        leftButton.className = "controlButton";
        leftButton.style.backgroundImage = "url(\"image/left button.png\")";
        leftButton.style.textAlign = "right";
        leftButton.ontouchstart = e => {
            Keyboard.press("ArrowLeft");
        };
        leftButton.ontouchend = e => {
            Keyboard.release("ArrowLeft");
        };
        document.body.appendChild(leftButton);

        rightButton = document.createElement("div");
        rightButton.className = "controlButton";
        rightButton.style.backgroundImage = "url(\"image/right button.png\")";
        rightButton.style.textAlign = "right";
        rightButton.ontouchstart = e => {
            Keyboard.press("ArrowRight");
        };
        rightButton.ontouchend = e => {
            Keyboard.release("ArrowRight");
        };
        document.body.appendChild(rightButton);
        resizeButton();
    }
}

function removeButton() {
    if (isMobile) {
        document.body.removeChild(jumpButton);
        document.body.removeChild(retryButton);
        document.body.removeChild(leftButton);
        document.body.removeChild(rightButton);
        jumpButton = null;
        retryButton = null;
        leftButton = null;
        rightButton = null;
    }
}

function resizeButton() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    jumpButton.style.left = "32px";
    jumpButton.style.top = `${windowHeight - 192}px`;
    retryButton.style.left = "224px";
    retryButton.style.top = `${windowHeight - 192}px`;
    leftButton.style.left = `${windowWidth - 384}px`;
    leftButton.style.top = `${windowHeight - 192}px`;
    rightButton.style.left = `${windowWidth - 192}px`;
    rightButton.style.top = `${windowHeight - 192}px`;
}

function getImagePaths(prefix, num) {
    const result = [];
    for (let i = 0; i != num; ++i) {
        result.push(`image/${prefix} ${i}.png`);
    }

    return result;
}

function drawSprite(spr, index, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(spr.getImage(index), -spr.originX, -spr.originY);
    ctx.restore();
}

function drawSpriteExt(spr, index, x, y, scaleX, scaleY, angle, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scaleX, scaleY);
    ctx.globalAlpha = alpha;
    ctx.drawImage(spr.getImage(index), -spr.originX, -spr.originY);
    ctx.globalAlpha = 1;
    ctx.restore();
}

function playMusic(sound) {
    if (Game.nowMusic !== sound) {
        Game.nowMusic = sound;
        if (Game.nowMusicBuffer !== null) {
            Sound.stop(Game.nowMusicBuffer);
        }
        Game.nowMusicBuffer = Sound.play(Sound.get(`audio/${sound}`), true);
    }
}

globalThis.level17_trigger0 = function () {
    destroyWithEffect(ObjectName.trigger0_brick0);
    destroyWithEffect(ObjectName.trigger0_brick1);
    destroyWithEffect(ObjectName.trigger0_brick2);
    destroyWithEffect(ObjectName.trigger0_brick3);
    const executer = new Executer();
    for (let i = 0; i != 16; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.x += 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
    Sound.play(Sound.get("audio/break.wav"));
};

globalThis.level19_trigger0 = function () {
    destroyWithEffect(ObjectName.trigger0_brick0);
    destroyWithEffect(ObjectName.trigger0_brick1);
    destroyWithEffect(ObjectName.trigger0_brick2);
    destroyWithEffect(ObjectName.trigger0_brick3);
    ObjectName.trigger0_save.destroy();
    const executer = new Executer();
    for (let i = 0; i != 8; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.x -= 4;
            ObjectName.trigger0_needle1.y -= 4;
            ObjectName.trigger0_needle2.y -= 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
    Sound.play(Sound.get("audio/break.wav"));
};

globalThis.level22_trigger0 = function () {
    destroyWithEffect(ObjectName.trigger0_brick0);
    const executer = new Executer();
    for (let i = 0; i != 8; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.x += 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
    Sound.play(Sound.get("audio/break.wav"));
};

globalThis.level28_trigger0 = function () {
    const executer = new Executer();
    for (let i = 0; i != 4; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.y -= 4;
            ObjectName.trigger0_needle1.y -= 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
};

globalThis.level29_trigger0 = function () {
    destroyWithEffect(ObjectName.trigger0_brick0);
    destroyWithEffect(ObjectName.trigger0_brick1);
    Sound.play(Sound.get("audio/break.wav"));
};

globalThis.level32_trigger0 = function () {
    destroyWithEffect(ObjectName.trigger0_brick0);
    destroyWithEffect(ObjectName.trigger0_brick1);
    destroyWithEffect(ObjectName.trigger0_brick2);
    destroyWithEffect(ObjectName.trigger0_brick3);
    const executer = new Executer();
    for (let i = 0; i != 4; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_miniNeedle0.y += 4;
            ObjectName.trigger0_miniNeedle1.y += 4;
            ObjectName.trigger0_needle0.y += 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
    Sound.play(Sound.get("audio/break.wav"));
};

globalThis.level34_trigger0 = function () {
    const executer = new Executer();
    for (let i = 0; i != 64; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.x += 1;
            ObjectName.trigger0_needle1.x += 1;
            ObjectName.trigger0_needle2.x += 1;
            ObjectName.trigger0_needle3.x -= 1;
            ObjectName.trigger0_needle4.x -= 1;
            ObjectName.trigger0_needle5.x -= 1;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
};

globalThis.level35_trigger0 = function () {
    const executer = new Executer();
    for (let i = 0; i != 8; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.y += 4;
            ObjectName.trigger0_needle1.y += 4;
            ObjectName.trigger0_needle2.y += 4;
        });
    }
    for (let i = 8; i != 16; ++i) {
        executer.addMoment(i, () => {
            ObjectName.trigger0_needle0.y += 4;
            ObjectName.trigger0_needle1.y += 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
};

globalThis.level38_trigger0 = function () {
    const executer = new Executer();
    for (let i = 0; i != 26; ++i) {
        executer.addMoment(i, () => {
            ObjectName.needle0.y -= 20.833333333333332;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
};

globalThis.level38_trigger1 = function () {
    const executer = new Executer();
    for (let i = 0; i != 16; ++i) {
        executer.addMoment(i, () => {
            ObjectName.needle2.x += 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
};

globalThis.level38_trigger2 = function () {
    const executer = new Executer();
    for (let i = 0; i != 115; ++i) {
        executer.addMoment(i, () => {
            ObjectName.needle3.x += 0.8333333333333334;
        });
    }
    executer.addMoment(115, () => {
        ObjectName.needle3.x = 512;
    });
    GameObject.create(GameObject.nowLayer, executer);
};

globalThis.level38_trigger3 = function () {
    const executer = new Executer();
    for (let i = 0; i != 8; ++i) {
        executer.addMoment(i, () => {
            ObjectName.needle0.x -= 4;
        });
    }
    GameObject.create(GameObject.nowLayer, executer);
};

function destroyWithEffect(obj) {
    GameObject.create(GameObject.nowLayer, new DestroyEffect(obj.x, obj.y, Game.stageSetting.brick));
    obj.destroy();
}

function choose(...values) {
    const r = Math.floor(values.length * Math.random());
    return values[r];
}