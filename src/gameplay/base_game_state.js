const COFFEE_LIMIT = 100.0;


export class BaseGameState {

    score = 0;
    coffeeAmount = 0.0;
    milkAmount = 0.0;
    serveTime = 0.0;
    targetRatio = 0.0;

    constructor(stateSetter) {
        this.stateSetter = stateSetter;
    }

    resetCup() {
        this.coffeeAmount = 0.0;
        this.milkAmount = 0.0;
        this.serveTime = 0.0;
    }

    getCoffeeProportion() {
        let totalFluid = coffeeAmount + milkAmount;
        if (totalFluid < 1e-2)
            return 0;
        return coffeeAmount / totalFluid;
    }

    getServeTimeString() {
        minutes = Math.min(9, Math.floor(this.serveTime / 60));
        seconds = `${Math.floor(this.serveTime % 60)}`.padStart(2, "0");
        millis = `${Math.floor(this.serveTime * 1000)}`.padStart(3, "0");
        return `${minutes}:${seconds}:${millis}`;
    }

    calculateScoreOfCup() {
    }

    tick(dt) {
        this.serveTime += dt;
    }

}
