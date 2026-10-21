import { BaseGameState, ACTION_NEW_CUP } from "./base_game_state.js";


export class PracticeState extends BaseGameState {

    previousServeInfo = {
        points: "-",
        fillError: "-",
        proportionError: "-",
        timeToServe: "-"
    };

    constructor(gameStateHandler) {
        super(gameStateHandler);
    }

    calculateScoreOfCup() {
        let scoreFactors = this.calculateScoreFactors();
        let points = Math.round(100 * scoreFactors.fillFactor * scoreFactors.proportionFactor * scoreFactors.timeFactor);

        let fillPercentage = Math.round(scoreFactors.fillError * 100_00) / 100; // Display up to 0.01% accuracy
        let fillPercentageString = `${fillPercentage}%`;
        if (fillPercentage > 0)
            fillPercentageString = `+${fillPercentageString}`;

        let proportionPercentage = Math.round(scoreFactors.proportionError * 100_00) / 100; // Ditto.
        let proportionPercentageString = `${proportionPercentage}%`;
        if (proportionPercentage > 0)
            proportionPercentageString = `+${proportionPercentageString}`;

        this.previousServeInfo.points = `${points}/100`;
        this.previousServeInfo.fillError = fillPercentageString;
        this.previousServeInfo.proportionError = proportionPercentageString;
        this.previousServeInfo.timeToServe = this.getServeTimeString();

        this.score = Math.max(Math.min(999_999_999, this.score + points), 0);
    }

    getPreviousServeInfo() {
        return this.previousServeInfo;
    }

    resetGameInfo() {
        this.previousServeInfo.points = "-";
        this.previousServeInfo.fillError = "-";
        this.previousServeInfo.proportionError = "-";
        this.previousServeInfo.timeToServe = "-";

        this.score = 0;
        this.resetCup();
        this.serveTime = 0.0;
        this.actionTime = 0.0;
        this.action = ACTION_NEW_CUP;
    }

}
