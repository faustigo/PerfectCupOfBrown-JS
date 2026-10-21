import { BaseScreen } from "./screen.js";
import { PracticeScreen } from "./practice_screen.js";
import { TimeAttackScreen } from "./time_attack_screen.js";
import { PerfectPourScreen } from "./perfect_pour_screen.js";
import { AboutScreen } from "./about_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";

import { PracticeState } from "../gameplay/practice_state.js";
import { TimeAttackState } from "../gameplay/time_attack_state.js";
import { PerfectPourState } from "../gameplay/perfect_pour_state.js";


export class TitleScreen extends BaseScreen {


    constructor(gameStateHandler) {
        super(gameStateHandler);

        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("Time Attack", gameCanvas.width / 2 - 130, 240, 260, 80, event => {
            this.gameStateHandler.setScreen(new TimeAttackScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new TimeAttackState());
        }));
        this.addWidget(new Button("Perfect Pours", gameCanvas.width / 2 - 130, 340, 260, 80, event => {
            this.gameStateHandler.setScreen(new PerfectPourScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new PerfectPourState());
        }));
        this.addWidget(new Button("Practice", gameCanvas.width / 2 - 130, 440, 260, 80, event => {
            this.gameStateHandler.setScreen(new PracticeScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(new PracticeState());
        }));
        this.addWidget(new Button("(i)", 20, gameCanvas.height - 80, 60, 60, event => {
            this.gameStateHandler.setScreen(new AboutScreen(this.gameStateHandler));
            this.gameStateHandler.setGameState(null);
        }));

        const docCookies = document.cookie.split(";");
        this.timeAttackHighScore = parseScore(docCookies.find(row => row.startsWith("pcob_time_attack_hi="))
            ?.split("=")[1]);
        this.perfectPourHighScore = parseScore(docCookies.find(row => row.startsWith("pcob_perfect_pour_hi="))
            ?.split("=")[1]);
    }

    render(gameCanvas, ctx, dt) {
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(gameCanvas.width/2 - 300, 80, 600, 120, 20);
        ctx.roundRect(gameCanvas.width/2 + 150, 250, 200, 60, 20);
        ctx.roundRect(gameCanvas.width/2 + 150, 350, 200, 60, 20);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "48px \"Verdana\"";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("A Perfect Cup of Brown", gameCanvas.width / 2, 140);
        ctx.font = "24px \"Verdana\"";
        ctx.textAlign = "left";
        ctx.fillText(`HI: ${this.timeAttackHighScore}`, gameCanvas.width/2 + 160, 280);
        ctx.fillText(`HI: ${this.perfectPourHighScore}`, gameCanvas.width/2 + 160, 380);

        super.render(gameCanvas, ctx, dt);
    }

}

function parseScore(string) {
    let parsed = Number.parseInt(string);
    return Number.isNaN(parsed) ? 0 : parsed;
}
