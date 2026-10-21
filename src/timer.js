export class Timer {

    constructor(targetFPS, runnable) {
        this.targetFPS = targetFPS | 30;
        this.runnable = runnable;
        this.interval = Math.floor(1000/this.targetFPS);
        this.timer = null;
        this.timeInit = null;
    }

    tick() {
        this.runnable();
        this.timeInit += this.interval;
        this.timer = setTimeout(this.tick.bind(this), this.timeInit - (new Date()).getTime());
    }

    start() {
        if (this.timer !== null)
            return;
        this.timeInit = (new Date()).getTime();
        this.tick();
    }

    stop() {
        clearTimeout(this.timer);
        this.timer = null;
    }

}
