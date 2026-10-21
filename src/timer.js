export class Timer {

    constructor(targetFPS, runnable) {
        this.targetFPS = targetFPS || 30;
        this.runnable = runnable;
        this.interval = Math.floor(1000/this.targetFPS);
        this.timer = null;
        this.timeInit = null;
    }

    tick() {
        this.runnable(this.interval/1000);
        let currentTime = (new Date()).getTime();
        if (currentTime - this.timeInit > this.interval * 2) {
            this.timeInit = currentTime + this.interval; // If lots of frames are skipped, just move to next frame
        } else {
            this.timeInit += this.interval;
        }
        this.timer = setTimeout(this.tick.bind(this), this.timeInit - currentTime);
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
