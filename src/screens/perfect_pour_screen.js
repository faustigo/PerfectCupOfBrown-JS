import { MainGameplayScreen } from "./game_screen.js";
import { TitleScreen } from "./title_screen.js";
import { Button } from "../gui/button.js";
import * as Colors from "../colors.js";

import { PerfectPourState } from "../gameplay/perfect_pour_state.js";


export class PerfectPourScreen extends MainGameplayScreen {

    gameOverButtons = [];


    constructor(gameStateHandler) {
        super(gameStateHandler);

        const gameCanvas = document.getElementById("gameCanvas");
        this.gameOverButtons.push(this.addWidget(new Button("Restart", gameCanvas.width / 2 - 120, 300, 240, 80, event => {
            this.gameStateHandler.setScreen(new PerfectPourScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new PerfectPourState());
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

        let errorRemainingX = 20;
        let errorRemainingY = gameCanvas.height - 110;
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(errorRemainingX, errorRemainingY, 230, 90, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textBaseline = "alphabetical";
        ctx.font = "24px \"Verdana\"";
        ctx.textAlign = "left";
        ctx.fillText("Error remaining", errorRemainingX + 20, errorRemainingY + 20);
        ctx.font = "36px \"Verdana\"";
        ctx.fillText(`${gameState.getErrorRemaining()}`, errorRemainingX + 20, errorRemainingY + 60);
        
        let previousServeInfoX = gameCanvas.width - 300;
        let previousServeInfoY = gameCanvas.height - 270;
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(previousServeInfoX, previousServeInfoY, 280, 90, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "24px \"Verdana\"";
        ctx.textBaseline = "alphabetical";
        ctx.textAlign = "left";
        ctx.fillText("Previous Serve", previousServeInfoX + 20, previousServeInfoY + 20);
        ctx.textAlign = "right";
        ctx.fillText(gameState.getLastCupScore(), previousServeInfoX + 260, previousServeInfoY + 60);

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
