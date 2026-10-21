const COFFEE_TARGET = 100.0;

const ACTION_NOTHING = 0;
const ACTION_SERVE = 1;
const ACTION_DISPOSE = 2;
const ACTION_NEW_CUP = 3;

const SERVE_TIME = 1.0;
const DISPOSE_TIME = 1.0;
const NEW_CUP_TIME = 1.0;


export class BaseGameState {

    score = 0;
    coffeeAmount = 0.0;
    milkAmount = 0.0;
    serveTime = 0.0;
    targetRatio = this.generateRandomTarget();
    paused = false;

    pouringCoffee = false;
    pouringMilk = false;
    coffeePourRate = 0.0;
    milkPourRate = 0.0;

    actionTime = 0.0;
    action = ACTION_NEW_CUP;

    constructor(gameStateHandler) {
        this.gameStateHandler = gameStateHandler;
    }

    resetCup() {
        this.coffeeAmount = 0.0;
        this.milkAmount = 0.0;
        this.setPouringCoffee(false);
        this.setPouringMilk(false);
    }

    getMilkProportion() {
        let totalFluid = this.coffeeAmount + this.milkAmount;
        if (totalFluid < 1e-2)
            return 0.0;
        return this.milkAmount / totalFluid;
    }

    getFilledProportion() {
        return (this.coffeeAmount + this.milkAmount) / COFFEE_TARGET;
    }

    getServeTimeString() {
        if (this.serveTime >= 600)
            return "9:59:999";
        let minutes = Math.min(9, Math.floor(this.serveTime / 60));
        let seconds = `${Math.floor(this.serveTime % 60)}`.padStart(2, "0");
        let millis = `${Math.floor(this.serveTime * 1000 % 1000)}`.padStart(3, "0");
        return `${minutes}:${seconds}:${millis}`;
    }

    calculateScoreOfCup() {
    }

    calculateScoreFactors() {
        let fillErrorRaw = (this.coffeeAmount + this.milkAmount - COFFEE_TARGET) / COFFEE_TARGET;
        let proportionErrorRaw = this.getMilkProportion() - this.targetRatio;
        if (this.coffeeAmount + this.milkAmount < 1e-2)
            proportionErrorRaw = -1.0;
        return {
            fillError: fillErrorRaw,
            proportionError: proportionErrorRaw,
            fillFactor: Math.max(0, 1 - Math.abs(fillErrorRaw)),
            proportionFactor: Math.max(0, 1 - Math.abs(proportionErrorRaw)),
            // Explainer for time factor:
            // this.serveTime - 30 => Start penalizing performance after 30 seconds
            // Math.exp(- " /30)   => Penalize performance according to an exponential decay (~36% @ 60s, ~5% @ 120s)
            // Math.min(1.5, ")    => At most x1.5 score for finishing early
            // Math.round(" * 100) / 100 => Round time factor to nearest 0.01
            timeFactor: Math.round(Math.min(1.5, Math.exp(-(this.serveTime-30)/30)) * 100) / 100,
        };
    }

    getScore() {
        return this.score;
    }

    getTargetProportion() {
        return this.targetRatio;
    }

    tick(dt) {
        if (this.paused)
            return;
        if (this.action === ACTION_SERVE) {
            this.actionTime += dt;
            if (this.actionTime >= SERVE_TIME) {
                this.actionTime = 0.0;
                this.action = ACTION_NEW_CUP;
                this.resetCup();
                this.targetRatio = this.generateRandomTarget();
            }
        } else if (this.action === ACTION_DISPOSE) {
            this.actionTime += dt;
            if (this.actionTime >= DISPOSE_TIME) {
                this.actionTime = 0.0;
                this.action = ACTION_NEW_CUP;
                this.resetCup();
            }
        } else if (this.action === ACTION_NEW_CUP) {
            this.actionTime += dt;
            if (this.actionTime >= NEW_CUP_TIME) {
                this.actionTime = 0.0;
                this.action = ACTION_NOTHING;
                this.resetCup();
            }
        } else {
            this.actionTime = 0.0;
        }
        if (this.action !== ACTION_SERVE)
            this.serveTime += dt;
        if (this.action === ACTION_NOTHING) {
            // TODO rate of pouring
            if (this.pouringCoffee)
                this.coffeeAmount += 10.0 * dt;
            if (this.pouringMilk)
                this.milkAmount += 10.0 * dt;
        }
    }

    getCupYOffsetFraction() {
        if (this.action === ACTION_SERVE) {
            let frac = this.actionTime / SERVE_TIME;
            return -this.actionTime * this.actionTime;
        }
        if (this.action === ACTION_DISPOSE) {
            let frac = this.actionTime / DISPOSE_TIME;
            return this.actionTime * this.actionTime;
        }
        if (this.action === ACTION_NEW_CUP) {
            if (this.actionTime < 0.0)
                return 1.0;
            let frac = 1 - this.actionTime / NEW_CUP_TIME;
            return Math.max(1 - this.actionTime * this.actionTime, 0.0);
        }
        return 0.0;
    }

    setPaused(paused) {
        this.paused = paused;
    }

    isPaused() {
        return this.paused;
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 27: // <Esc>
                this.setPaused(true);
                break;
            case 67: // c
                this.setPouringCoffee(true);
                break;
            case 68: // d
                this.disposeCoffee();
                break;
            case 77: // m
                this.setPouringMilk(true);
                break;
            case 83: // s
                this.serveCoffee();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case 67: // c
                this.setPouringCoffee(false);
                break;
            case 77: // m
                this.setPouringMilk(false);
                break;
        }
    }

    setPouringCoffee(pouringCoffee) {
        this.pouringCoffee = pouringCoffee && this.action === ACTION_NOTHING;
    }

    setPouringMilk(pouringMilk) {
        this.pouringMilk = pouringMilk && this.action === ACTION_NOTHING;
    }

    serveCoffee() {
        if (this.action !== ACTION_NOTHING)
            return;
        this.calculateScoreOfCup();
        this.actionTime = 0;
        this.serveTime = 0;
        this.action = ACTION_SERVE;
    }

    disposeCoffee() {
        if (this.action !== ACTION_NOTHING)
            return;
        this.actionTime = 0;
        this.action = ACTION_DISPOSE;
    }

    generateRandomTarget() {
        return Math.random() * 0.8; // Avoid milk-heavy drinks
    }

}
