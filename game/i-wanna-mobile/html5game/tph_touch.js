const touchedX = [];
const touchedY = [];
const releasedX = [];
const releasedY = [];
let touches = [];

function touch_init() {
    addEventListener("touchstart", e => {
        for (const touch of e.changedTouches) {
            touchedX.push(touch.screenX);
            touchedY.push(touch.screenY);
        }
        touches = e.touches;
    });
    addEventListener("touchmove", e => {
        touches = e.touches;
    });
    addEventListener("touchend", e => {
        for (const touch of e.changedTouches) {
            releasedX.push(touch.screenX);
            releasedY.push(touch.screenY);
        }
        touches = e.touches;
    });

    return 0;
}

function touched_length() {
    return touchedX.length;
}

function touched_get_x(i) {
    return touchedX[i];
}

function touched_get_y(i) {
    return touchedY[i];
}

function released_length() {
    return releasedX.length;
}

function released_get_x(i) {
    return releasedX[i];
}

function released_get_y(i) {
    return releasedY[i];
}

function touches_length() {
    return touches.length;
}

function touches_get_x(i) {
    return touches[i].screenX;
}

function touches_get_y(i) {
    return touches[i].screenY;
}

function touch_loop() {
    touchedX.length = 0;
    touchedY.length = 0;
    releasedX.length = 0;
    releasedY.length = 0;
    return 0;
}