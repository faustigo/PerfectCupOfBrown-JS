export class Timer {

    constructor(targetFPS, runnable) {
        this.targetFPS = targetFPS | 30;
        this.runnable = runnable;
        this.interval = Math.floor(1000/this.targetFPS);
        this.timer = null;
        this.timeInit = null;
    }

    tick(timerObj) {
        timerObj.runnable();
        timerObj.timeInit += timerObj.interval;
        timerObj.timer = setTimeout(() => timerObj.tick(timerObj), this.timeInit - (new Date()).getTime());
    }

    start() {
        if (this.timer !== null)
            return;
        this.timeInit = (new Date()).getTime();
        this.tick(this);
    }

    stop() {
        clearTimeout(this.timer);
        this.timer = null;
    }

}
