import { MainGameplayScreen } from "./game_screen.js";
import { TitleScreen } from "./title_screen.js";
import { Button } from "../gui/button.js";
import * as Colors from "../colors.js";

import { TimeAttackState } from "../gameplay/time_attack_state.js";


export class TimeAttackScreen extends MainGameplayScreen {

    gameOverButtons = [];

    constructor(gameStateHandler) {
        super(gameStateHandler);

        const gameCanvas = document.getElementById("gameCanvas");
        this.gameOverButtons.push(this.addWidget(new Button("Restart", gameCanvas.width / 2 - 120, 300, 240, 80, event => {
            this.gameStateHandler.setScreen(new TimeAttackScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new TimeAttackState());
        })));
        this.gameOverButtons.push(this.addWidget(new Button("Main Menu", gameCanvas.width / 2 - 120, 400, 240, 80, event => {
            this.gameStateHandler.setScreen(new TitleScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(null);
        })));
        for (let i = 0; i < this.gameOverButtons.length; ++i)
            this.gameOverButtons[i].setActive(false);
    }

    renderGameInfo(gameCanvas, ctx, dt, gameState) {
        if (gameState.isGameFinished()) {
            for (let i = 0; i < this.gameOverButtons.length; ++i)
                this.gameOverButtons[i].setActive(true);
        }

        super.renderGameInfo(gameCanvas, ctx, dt, gameState);

        let timerX = 20;
        let timerY = gameCanvas.height - 110;
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(timerX, timerY, 220, 90, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textBaseline = "alphabetical";
        ctx.font = "24px \"Verdana\"";
        ctx.textAlign = "left";
        ctx.fillText("Time left", timerX + 20, timerY + 20);
        ctx.font = "36px \"Verdana\"";
        ctx.fillText(gameState.getRemainingTimeString(), timerX + 20, timerY + 60);

        let timeBonus = gameState.getDisplayedTimeBonus();
        if (timeBonus) {
            // Render time bonus
            let timeBonusX = timerX;
            let timeBonusY = timerY - 80;
            let oldGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = Math.min(1, timeBonus.displayTime);
            ctx.fillStyle = Colors.COFFEE_BROWN;
            ctx.beginPath();
            ctx.roundRect(timeBonusX, timeBonusY, 120, 60, 20);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.textBaseline = "middle";
            ctx.font = "36px \"Verdana\"";
            ctx.textAlign = "left";
            ctx.fillText(timeBonus.extraTimeString, timeBonusX + 20, timeBonusY + 30);
            ctx.globalAlpha = oldGlobalAlpha;
        }

        if (gameState.isGameFinished()) {
            let gameOverInfoX = gameCanvas.width / 2 - 200;
            let gameOverInfoY = 100;

            let oldGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = Colors.COFFEE_BROWN_PAUSED;
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            ctx.globalAlpha = oldGlobalAlpha;
            // Render game over text
            ctx.fillStyle = Colors.COFFEE_BROWN;
            ctx.beginPath();
            ctx.roundRect(gameOverInfoX, gameOverInfoY, 400, 100, 20);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetical";
            ctx.font = "36px \"Verdana\"";
            ctx.fillText("Game Over", gameOverInfoX + 200, gameOverInfoY + 30);
            ctx.font = "24px \"Verdana\"";
            ctx.fillText(`Score: ${gameState.getScore()}`, gameOverInfoX + 200, gameOverInfoY + 70);
        }
    }

}
