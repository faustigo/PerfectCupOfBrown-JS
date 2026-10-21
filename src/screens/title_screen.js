import { BaseScreen } from "./screen.js";
import { MainGameplayScreen } from "./game_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";
import { BaseGameState } from "../gameplay/base_game_state.js";


export class TitleScreen extends BaseScreen {

    constructor(gameStateHandler) {
        super(gameStateHandler);
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Let's Pour!", gameCanvas.width / 2 - 120, 240, 240, 80, event => {
            this.gameStateHandler.setScreen(new MainGameplayScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new BaseGameState());
        }));
    }

    render(gameCanvas, ctx, dt) {
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(gameCanvas.width/2 - 300, 80, 600, 120, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "48px \"Verdana\"";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("A Perfect Cup of Brown", gameCanvas.width / 2, 140);
        super.render(gameCanvas, ctx, dt);
    }

}
