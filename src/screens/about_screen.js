import { BaseScreen } from "./screen.js";
import { TitleScreen } from "./title_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


const ABOUT_TEXT = [
    "A Perfect Cup of Brown",
    "",
    "Created and programmed by faustigo",
    "2026. All Rights Reserved."
];


export class AboutScreen extends BaseScreen {


    constructor(gameStateHandler) {
        super(gameStateHandler);

        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Back", 20, 20, 120, 80, event => {
            this.gameStateHandler.setScreen(new TitleScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(null);
        }));
    }

    render(gameCanvas, ctx, dt) {
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = Colors.COFFEE_BROWN_PAUSED;
        let oldGlobalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fill();
        ctx.globalAlpha = oldGlobalAlpha;

        let textX = 100;
        let textY = 130;
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(textX, textY, gameCanvas.width - 200, 80 + ABOUT_TEXT.length * 30, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetical";
        ctx.font = "36px \"Verdana\"";
        ctx.fillText("About", textX + 10, textY + 40);
        textY += 80;
        ctx.font = "24px \"Verdana\"";
        for (let i = 0; i < ABOUT_TEXT.length; ++i) {
            ctx.fillText(ABOUT_TEXT[i], textX + 10, textY);
            textY += 30;
        }

        super.render(gameCanvas, ctx, dt);
    }

    onKeyDown(event) {
        if (event.keyCode === 27) {
            this.gameStateHandler.setScreen(new TitleScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(null);
        }
    }

}
