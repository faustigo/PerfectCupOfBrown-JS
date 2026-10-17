import { BaseScreen } from "./screen.js";
import * as Assets from "../asset_index.js";
import { Button } from "../gui/button.js";

const COFFEE_BROWN_TEXT = "#6F4E37";

export class TitleScreen extends BaseScreen {

    constructor(screenSetter) {
        super(screenSetter);
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Let's Pour!", gameCanvas.width / 2 - 120, 240, 240, 80, event => {
            console.log("Let's Pour Clicked");
        }));
    }

    render(gameCanvas, ctx) {
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = COFFEE_BROWN_TEXT;
        ctx.beginPath();
        ctx.roundRect(gameCanvas.width/2 - 300, 80, 600, 120, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "48px \"Verdana\"";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("A Perfect Cup of Brown", gameCanvas.width / 2, 140);
        super.render(gameCanvas, ctx);
    }

}
