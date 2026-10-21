import { BaseScreen } from "./screen.js";
import { TitleScreen } from "./title_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


export class PauseScreen extends BaseScreen {
    
    displayHelp = false;
    pauseButtons = [];
    helpButtons = [];

    constructor(gameStateHandler, parentScreen) {
        super(gameStateHandler);

        this.parentScreen = parentScreen;
 
        const gameCanvas = document.getElementById("gameCanvas");
        this.pauseButtons.push(this.addWidget(new Button("Resume", gameCanvas.width / 2 - 120, 90, 240, 80, event => {
            if (this.gameStateHandler.getGameState()) {
                this.gameStateHandler.getGameState().setPaused(false);
                this.clearHovering();
            }
        })));
        this.pauseButtons.push(this.addWidget(new Button("Main Menu", gameCanvas.width / 2 - 120, 230, 240, 80, event => {
            this.gameStateHandler.setScreen(new TitleScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(null);
        })));
        this.pauseButtons.push(this.addWidget(new Button("Help", gameCanvas.width / 2 - 120, 370, 240, 80, event => {
            this.setDisplayHelpScreen(true);
        })));
        this.helpButtons.push(this.addWidget(new Button("Back", 20, 20, 120, 80, event => {
            this.setDisplayHelpScreen(false);
        })));
        for (let i = 0; i < this.helpButtons.length; ++i)
            this.helpButtons[i].setActive(false);
    }

    render(gameCanvas, ctx, dt) {
        var oldGlobalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = Colors.COFFEE_BROWN_PAUSED;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.globalAlpha = oldGlobalAlpha;
        super.render(gameCanvas, ctx, dt);

        if (this.displayHelp && this.gameStateHandler.getGameState()) {
            ctx.fillStyle = Colors.COFFEE_BROWN;
            let helpLines = this.gameStateHandler.getGameState().getHelpLines();
            let textX = 100;
            let textY = 130;
            ctx.beginPath();
            ctx.roundRect(textX, textY, gameCanvas.width - 200, 20 + helpLines.length * 20, 20);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = "18px \"Verdana\"";
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetical";
            for (let i = 0; i < helpLines.length; ++i) {
                ctx.fillText(helpLines[i], textX + 10, textY + 20);
                textY += 20;
            }
        }
    }

    onKeyDown(event) {
        if (event.keyCode === 27 && this.gameStateHandler.getGameState()) {
            if (this.displayHelp) {
                this.setDisplayHelpScreen(false);
            } else {
                this.gameStateHandler.getGameState().setPaused(false);
                this.parentScreen.clearHovering();
            }
        }
    }

    setDisplayHelpScreen(displayHelp) {
        this.displayHelp = displayHelp;
        for (let i = 0; i < this.pauseButtons.length; ++i)
            this.pauseButtons[i].setActive(!displayHelp);
        for (let i = 0; i < this.helpButtons.length; ++i)
            this.helpButtons[i].setActive(displayHelp); 
    }

}
