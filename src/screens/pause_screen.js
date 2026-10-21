import { BaseScreen } from "./screen.js";
import { TitleScreen } from "./title_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


export class PauseScreen extends BaseScreen {
    
    constructor(gameStateHandler, parentScreen) {
        super(gameStateHandler);

        this.parentScreen = parentScreen;
 
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Resume", gameCanvas.width / 2 - 120, 90, 240, 80, event => {
            if (this.gameStateHandler.getGameState()) {
                this.gameStateHandler.getGameState().setPaused(false);
                this.clearHovering();
            }
        }));
        this.addWidget(new Button("Main Menu", gameCanvas.width / 2 - 120, 230, 240, 80, event => {
            this.gameStateHandler.setScreen(new TitleScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(null);
        }));
        this.addWidget(new Button("Help", gameCanvas.width / 2 - 120, 370, 240, 80, event => {
            // TODO help button
        }));
    }

    render(gameCanvas, ctx, dt) {
        var oldGlobalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = Colors.COFFEE_BROWN_PAUSED;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.globalAlpha = oldGlobalAlpha;
        super.render(gameCanvas, ctx, dt);
    }

    onKeyDown(event) {
        if (event.keyCode === 27 && this.gameStateHandler.getGameState())
            this.gameStateHandler.getGameState().setPaused(false);
    }

}
