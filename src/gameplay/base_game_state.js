const COFFEE_TARGET = 100.0;

export const ACTION_NOTHING = 0;
export const ACTION_SERVE = 1;
export const ACTION_DISPOSE = 2;
export const ACTION_NEW_CUP = 3;

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

        let fillErrorAbs = Math.abs(fillErrorRaw);
        let proportionErrorAbs = Math.abs(proportionErrorRaw);

        // Punish fill error greatly (including subtraction) when error is under -10% or over +5%
        // Normal fill punishment around [-10%, +5%], no subtraction 
        let fillFactor = fillErrorRaw < -0.10 ? Math.max(-1, Math.min(1, (1 - fillErrorAbs*2)**3)) :
                          fillErrorRaw > 0.05 ? Math.max(-1, Math.min(1, (1 - fillErrorAbs*6)**3)) :
                                                Math.max(0, Math.min(1, (1 - fillErrorAbs)**3));
        fillFactor *= 0.75;
        let proportionFactor = 0.25 * Math.max(-1, (1 - proportionErrorAbs*4)**3);
        // Explainer for time factor:
        // this.serveTime - 31.5 => Start penalizing performance after 31 seconds (max benefits if time < 10s)
        // Math.exp(- " /30)-1 => Penalize performance according to an exponential decay (~-30% @ 60s, ~-47% @ 120s)
        // Math.min(1, ")      => At most x1 factor for finishing early
        // Math.round(" * 100) / 100 => Round time factor to nearest 0.01
        // 0.5 * "             => Time factor is in range [-0.5, 0.5]
        let timeFactor = 0.25 * Math.round(Math.min(1, Math.exp(-(this.serveTime-31)/30)-1) * 100) / 100;

        return {
            fillError: fillErrorRaw,
            proportionError: proportionErrorRaw,
            fillFactor: fillFactor,
            proportionFactor: proportionFactor,
            timeFactor: timeFactor
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
        if (this.action === ACTION_NOTHING && (this.pouringCoffee || this.pouringMilk)) {
            let addedCoffee = 0.0;
            let addedMilk = 0.0;
            
            // TODO rate of pouring
            if (this.pouringCoffee)
                addedCoffee = 10.0 * dt;
            if (this.pouringMilk)
                addedMilk = 10.0 * dt;

            let totalOldFluid = this.coffeeAmount + this.milkAmount;
            let totalNewFluid = addedCoffee + addedMilk;
            let OVERFLOW_LIMIT = COFFEE_TARGET * 166 / 125; // Ratio taken from visual coffee overflow (screens/game_screen.js)
            if (totalOldFluid + totalNewFluid <= OVERFLOW_LIMIT) {
                // Old fluid and new fluid combined is under coffee target
                // Simple fluid addition
                this.coffeeAmount += addedCoffee;
                this.milkAmount += addedMilk;
            } else if (totalNewFluid > OVERFLOW_LIMIT) {
                // New fluid exceeds overflow limit and replaces all contents immediately
                // Add the new fluid, but scaled
                let scaling = OVERFLOW_LIMIT / totalNewFluid;
                this.coffeeAmount = addedCoffee * scaling;
                this.milkAmount = addedMilk * scaling;
            } else {
                // Substantial amount of old fluid
                // First, add incoming concentration to fill in remainder of cup before overflowing
                let newCoffeeConcentration = addedCoffee / totalNewFluid;
                let newMilkConcentration = addedMilk / totalNewFluid;
                let oldFluidGap = OVERFLOW_LIMIT - totalOldFluid;
                this.coffeeAmount += oldFluidGap * newCoffeeConcentration;
                this.milkAmount += oldFluidGap * newMilkConcentration;

                totalNewFluid -= oldFluidGap; // Get remainder of incoming fluid that isn't added
                let oldCoffeeConcentration = this.coffeeAmount / totalOldFluid; 
                let oldMilkConcentration = this.milkAmount / totalOldFluid; 
                 
                // Displace amount of old concentration equivalent to remainder incoming fluid, then
                // add remainder incoming fluid with the new concentration
                // (Old fluid) - (old fluid concentration)*(new fluid amount) + (new fluid concentration)*(new fluid amount)
                // = (Old fluid) + ((new fluid concentration) - (old fluid concentration))*(new fluid amount)
                this.coffeeAmount = Math.max(0, this.coffeeAmount + (newCoffeeConcentration - oldCoffeeConcentration)*totalNewFluid);
                this.milkAmount = Math.max(0, this.milkAmount + (newMilkConcentration - oldMilkConcentration)*totalNewFluid);
            }
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

    getHelpLines() {
        return [
            "Controls",
            "",
            "<C> - pour coffee   <M> - pour milk",
            "<S> - serve cup     <D> - discard cup",
            "<Escape> - Pause Menu/Unpause",
            "---",
            "How to Play",
            "",
            "Pour coffee and milk into the coffee cup.",
            "The proportion of coffee and milk poured will change the color.",
            "Try to match the shade of coffee shown, fill to the dashed line,",
            "  and pour as quickly as possible.",
            "More points are rewarded for pouring accurately and fast.",
            "Points can be deducted for under- or overfilling the cup,",
            "or serving a much different shade of coffee."
        ];
    }

}
