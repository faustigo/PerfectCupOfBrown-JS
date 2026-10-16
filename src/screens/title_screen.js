import { BaseScreen } from "./screen.js";
import * as Assets from "../asset_index.js";

const COFFEE_BROWN_TEXT = "#6F4E37";

export class TitleScreen extends BaseScreen {

    constructor(screenSetter) {
        super(screenSetter);
    }

    render() {
        const gameCanvas = document.getElementById("gameCanvas");
        const ctx = gameCanvas.getContext("2d");
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = COFFEE_BROWN_TEXT;
        ctx.roundRect(gameCanvas.width/2 - 300, 80, 600, 120, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "48px \"Verdana\"";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`A Perfect Cup of Brown`, gameCanvas.width / 2, 140);
        ctx.fillStyle = COFFEE_BROWN_TEXT;
        ctx.font = "36px \"Verdana\"";
        ctx.textBaseline = "top";
        ctx.fillText("Test text", gameCanvas.width / 2, 220);
    }

}
