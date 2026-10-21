import { MainGameplayScreen } from "./game_screen.js";
import { Button } from "../gui/button.js";
import * as Colors from "../colors.js";


export class PracticeScreen extends MainGameplayScreen {

    displayPreviousServeInfo = true;

    constructor(gameStateHandler) {
        super(gameStateHandler);
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("^", gameCanvas.width - 300, gameCanvas.height - 220, 60, 40, event => {
            this.displayPreviousServeInfo = !this.displayPreviousServeInfo;
        }));
        this.addWidget(new Button("Reset Practice", gameCanvas.width - 220, gameCanvas.height - 220, 200, 40, event => {
            if (this.gameStateHandler.getGameState())
                this.gameStateHandler.getGameState().resetGameInfo();
        }, "24px \"Verdana\""));
    }

    renderGameInfo(gameCanvas, ctx, dt, gameState) {
        super.renderGameInfo(gameCanvas, ctx, dt, gameState);
        if (this.displayPreviousServeInfo) {
            let previousServeInfo = gameState.getPreviousServeInfo();
            let previousServeInfoX = gameCanvas.width - 300;
            let previousServeInfoY = gameCanvas.height - 470;
            ctx.fillStyle = Colors.COFFEE_BROWN;
            ctx.beginPath();
            ctx.roundRect(previousServeInfoX, previousServeInfoY, 280, 230, 20);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = "18px \"Verdana\"";
            ctx.textBaseline = "alphabetical";
            ctx.textAlign = "left";
            ctx.fillText("Points", previousServeInfoX + 20, previousServeInfoY + 20);
            ctx.fillText("Fill Error", previousServeInfoX + 20, previousServeInfoY + 70);
            ctx.fillText("Mix Error", previousServeInfoX + 20, previousServeInfoY + 120);
            ctx.fillText("Serve Time", previousServeInfoX + 20, previousServeInfoY + 170);
            ctx.textAlign = "right";
            ctx.fillText(previousServeInfo.points, previousServeInfoX + 260, previousServeInfoY + 42);
            ctx.fillText(previousServeInfo.fillError, previousServeInfoX + 260, previousServeInfoY + 92);
            ctx.fillText(previousServeInfo.proportionError, previousServeInfoX + 260, previousServeInfoY + 142);
            ctx.fillText(previousServeInfo.timeToServe, previousServeInfoX + 260, previousServeInfoY + 192);
        }
    }

}
