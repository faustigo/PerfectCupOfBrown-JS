import { BaseGameState } from "./base_game_state.js";

const MAX_TIME = 3*60; // 3 minutes

export class TimeAttackState extends BaseGameState {

    timeRemaining = MAX_TIME;
    gameFinished = false;
    extraTimeBonus = 5;
    displayBonus = null;


    constructor(gameStateHandler) {
        super(gameStateHandler);
    }

    calculateScoreOfCup() {
        let scoreFactors = this.calculateScoreFactors();
        let scalar = Math.max(-1, scoreFactors.fillFactor + scoreFactors.proportionFactor + scoreFactors.timeFactor); 
        let points = Math.round(100 * scalar);
        this.score = Math.max(Math.min(999_999_999, this.score + points), 0);
        if (points > 100) {
            // Grant diminishing bonuses for cups over 100
            let extraTimeAdded = Math.floor(this.extraTimeBonus*(points-100)/25);
            if (extraTimeAdded > 0) {
                this.timeRemaining += extraTimeAdded;
                this.timeRemaining = Math.min(MAX_TIME, this.timeRemaining);
                this.extraTimeBonus = Math.max(1, this.extraTimeBonus/1.025);
                this.displayBonus = {
                    extraTimeString: `+${extraTimeAdded}s`,
                    displayTime: 2.0
                };
            }
        }
    }

    tick(dt) {
        if (this.paused || this.gameFinished)
            return;
        super.tick(dt);
        this.timeRemaining -= dt;
        if (this.timeRemaining <= 0) {
            this.gameFinished = true;
            document.cookie = `pcob_time_attack_hi=${this.score}`;
        }
        if (this.displayBonus) {
            this.displayBonus.displayTime -= dt;
            if (this.displayBonus.displayTime <= 0)
                this.displayBonus = null;
        }
    }

    getRemainingTimeString() {
        if (this.timeRemaining <= 0)
            return "0:00:000";
        if (this.timeRemaining >= 600)
            return "9:59:999";
        let minutes = Math.min(9, Math.floor(this.timeRemaining / 60));
        let seconds = `${Math.floor(this.timeRemaining % 60)}`.padStart(2, "0");
        let millis = `${Math.floor(this.timeRemaining * 1000 % 1000)}`.padStart(3, "0");
        return `${minutes}:${seconds}:${millis}`;
    }

    isGameFinished() {
        return this.gameFinished;
    }

    getDisplayedTimeBonus() {
        return this.displayBonus;
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
            "or serving a much different shade of coffee.",
            "Serve as much coffee as possible in the given time.",
            "Gain additional time by serving perfect coffees fast."
        ];
    }

    onKeyDown(event) {
        if (!this.gameFinished)
            super.onKeyDown(event);
    }

    setPaused(paused) {
        this.paused = paused && !this.gameFinished;
    }

}
