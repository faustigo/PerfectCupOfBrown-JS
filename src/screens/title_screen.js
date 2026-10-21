import { BaseScreen } from "./screen.js";
import { PracticeScreen } from "./practice_screen.js";
import { TimeAttackScreen } from "./time_attack_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";

import { PracticeState } from "../gameplay/practice_state.js";
import { TimeAttackState } from "../gameplay/time_attack_state.js";


export class TitleScreen extends BaseScreen {

    constructor(gameStateHandler) {
        super(gameStateHandler);

        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Time Attack", gameCanvas.width / 2 - 130, 240, 260, 80, event => {
            this.gameStateHandler.setScreen(new TimeAttackScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new TimeAttackState());
        }));
        this.addWidget(new Button("Perfect Pours", gameCanvas.width / 2 - 130, 340, 260, 80, event => {
            // TODO perfection
        }));
        this.addWidget(new Button("Practice", gameCanvas.width / 2 - 130, 440, 260, 80, event => {
            this.gameStateHandler.setScreen(new PracticeScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new PracticeState());
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
