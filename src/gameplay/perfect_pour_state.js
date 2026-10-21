import { BaseGameState } from "./base_game_state.js";


export class PerfectPourState extends BaseGameState {

    gameFinished = false;
    errorRemaining = 100;
    lastCupScore = "-";


    constructor(gameStateHandler) {
        super(gameStateHandler);
    }

    calculateScoreOfCup() {
        let scoreFactors = this.calculateScoreFactors();
        let scalar = Math.max(-1, scoreFactors.fillFactor + scoreFactors.proportionFactor + scoreFactors.timeFactor); 
        let points = Math.round(100 * scalar);
        this.lastCupScore = `${points}/100`;
        if (points >= 50) // Award cup served if it is at least this criteria
            ++this.score;
        
        let error = Math.max(0, 100 - points);
        this.errorRemaining = Math.max(this.errorRemaining - error, 0); // Subtract score for imperfection
        if (this.errorRemaining <= 0) {
            this.gameFinished = true;
            document.cookie = `pcob_perfect_pour_hi=${this.score}`;
        }
    }

    tick(dt) {
        if (this.paused || this.gameFinished)
            return;
        super.tick(dt);
    }

    getErrorRemaining() {
        return this.errorRemaining;
    }

    getLastCupScore() {
        return this.lastCupScore;
    }

    isGameFinished() {
        return this.gameFinished;
    }
    
    disposeCoffee() {
        super.disposeCoffee();
        this.errorRemaining -= 20;
    }

    getHelpLines() {
        let lines = super.getHelpLines();
        lines.push(
            "Serve as many coffee cups as perfectly as possible.",
            "Only cups scoring at least 50 points are counted.",
            "The Error Remaining score decreases when cups score below 100,",
            "  or when a cup is discarded.",
            "The game ends when the Error Remaining score reaches 0.");
        return lines;
    }

    onKeyDown(event) {
        if (!this.gameFinished)
            super.onKeyDown(event);
    }

    setPaused(paused) {
        this.paused = paused && !this.gameFinished;
    }

}
