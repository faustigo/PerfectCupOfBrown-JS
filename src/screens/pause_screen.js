import { BaseScreen } from "./screen.js";
import { TitleScreen } from "./title_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


export class PauseScreen extends BaseScreen {
    
    constructor(screenSetter, parentScreen) {
        super(screenSetter);

        this.parentScreen = parentScreen;
 
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Resume", gameCanvas.width / 2 - 120, 60, 240, 80, event => {
            this.parentScreen.setPaused(false);
        }));
        this.addWidget(new Button("Main Menu", gameCanvas.width / 2 - 120, 200, 240, 80, event => {
            this.screenSetter(new TitleScreen(this.screenSetter));
        }));
        this.addWidget(new Button("Help", gameCanvas.width / 2 - 120, 200, 240, 80, event => {
            // TODO help button
        }));
    }

    render(gameCanvas, ctx) {
        var oldGlobalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = Colors.COFFEE_BROWN_PAUSED;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.globalAlpha = oldGlobalAlpha;
        super.render(gameCanvas, ctx);
    }

    onKeyDown(event) {
        if (event.keyCode === 27)
            this.parentScreen.setPaused(false);
    }

}
