import { BaseScreen } from "./screen.js";
import { PauseScreen } from "./pause_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


export class MainGameplayScreen extends BaseScreen {
    
    cycleTime = 0.0;

    constructor(gameStateHandler) {
        super(gameStateHandler);

        this.pauseScreen = new PauseScreen(this.gameStateHandler, this);
        
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("||", 20, 20, 60, 60, event => {
            if (this.gameStateHandler.getGameState())
                this.gameStateHandler.getGameState().setPaused(true);
        }));
    }

    render(gameCanvas, ctx, dt) {
        let gameState = this.gameStateHandler.getGameState();
        let paused = this.isPaused();
        const CYCLE_SPEED = 1.0;
        const MARKER_DASH_LENGTH = 20;
        const MARKER_DASHES = 30;
        if (!paused) {
            this.cycleTime += dt;
            this.cycleTime %= CYCLE_SPEED;
        }
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);

        let cupX = gameCanvas.width / 2;
        let cupY = 400;

        let milkProportion = 0.0;
        let coffeeFillProportion = 0.0;
        if (gameState) {
            milkProportion = gameState.getMilkProportion();
            coffeeFillProportion = gameState.getFilledProportion();
            let offsetProportion = gameState.getCupYOffsetFraction();
            cupY += Math.floor(500 * offsetProportion);
        }

        let coffeeShade = Colors.coffeeColor(milkProportion);
        let coffeeHeight = 125 * coffeeFillProportion;
        let coffeeRadiusX = 88 + (110 - 88) * coffeeFillProportion;
        let coffeeRadiusY = 80 + (100 - 80) * coffeeFillProportion;

        // Draw base
        // Shadow
        ctx.fillStyle = Colors.PAPER_CUP_SHADE_1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY, 105, 100, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        // Inside wall
        let insideGradient = ctx.createLinearGradient(cupX - 120, cupY, cupX + 120, cupY);
        insideGradient.addColorStop(0, Colors.PAPER_CUP_OFF_WHITE_1);
        insideGradient.addColorStop(1, Colors.PAPER_CUP_OFF_WHITE_3);
        ctx.fillStyle = insideGradient;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 150, 115, 105, 0, 0, Math.PI * 2);
        ctx.fill();
        // Floor
        ctx.fillStyle = Colors.PAPER_CUP_OFF_WHITE_2;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY, 90, 83, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = Colors.PAPER_CUP_OFF_WHITE_3;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.ellipse(cupX, cupY, 90, 83, 0, 0, Math.PI, true);
        ctx.stroke();
        // Marker
        ctx.lineWidth = 2;
        ctx.strokeStyle = Colors.PAPER_CUP_SHADE_1;
        let dashes = [Math.floor(this.cycleTime / CYCLE_SPEED * MARKER_DASH_LENGTH * 2)];
        if (dashes[0] > MARKER_DASH_LENGTH) {
            let remainder = dashes[0] - MARKER_DASH_LENGTH;
            dashes[0] = 0;
            dashes.push(remainder);
            dashes.push(MARKER_DASH_LENGTH);
        }
        for (let i = 0; i < MARKER_DASHES; ++i)
            dashes.push(MARKER_DASH_LENGTH);
        ctx.setLineDash(dashes);
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 125, 110, 100, 0, Math.PI-0.1, 0.1, false);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw coffee if not overflowing
        let overflowing = coffeeHeight > 150;
        if (!overflowing && coffeeHeight > 1e-2) {
            ctx.fillStyle = coffeeShade;
            ctx.beginPath();
            ctx.ellipse(cupX, cupY - coffeeHeight, coffeeRadiusX, coffeeRadiusY, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw top
        // Cup body
        let outsideGradient = ctx.createLinearGradient(cupX - 120, cupY, cupX + 120, cupY);
        outsideGradient.addColorStop(0, Colors.PAPER_CUP_OFF_WHITE_1);
        outsideGradient.addColorStop(0.8, Colors.PAPER_CUP_OFF_WHITE_2);
        outsideGradient.addColorStop(1, Colors.PAPER_CUP_OFF_WHITE_3);
        ctx.fillStyle = outsideGradient;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 150, 120, 110, 0, 0, Math.PI);
        ctx.lineTo(cupX - 90, cupY);
        ctx.ellipse(cupX, cupY, 90, 83, 0, Math.PI, 0, true);
        ctx.lineTo(cupX + 120, cupY - 150);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = Colors.PAPER_CUP_OFF_WHITE_3;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 10, 90, 83, 0, 0.15, Math.PI-0.15, false);
        ctx.stroke();
        // Rim
        ctx.lineWidth = 10;
        ctx.strokeStyle = Colors.PAPER_CUP_OFF_WHITE_3;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 145, 120, 110, 0, 0, Math.PI, false);
        ctx.stroke();
        ctx.strokeStyle = Colors.PAPER_CUP_WHITE;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 150, 120, 110, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw coffee if overflowing
        if (overflowing) {
            let overflowRadius = Math.min(coffeeHeight - 150, 16);
            ctx.fillStyle = coffeeShade;
            ctx.beginPath();
            ctx.ellipse(cupX, cupY - 150, 115 + overflowRadius, 105 + overflowRadius, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // TODO draw coffee and milk jugs when pouring?


        // Render game state-dependent info
        if (gameState) {
            this.renderGameInfo(gameCanvas, ctx, dt, gameState);
            this.renderCustomerRequest(gameCanvas, ctx, dt, gameState);
        }

        super.render(gameCanvas, ctx, dt);

        if (paused)
            this.pauseScreen.render(gameCanvas, ctx, dt);
    }

    renderGameInfo(gameCanvas, ctx, dt, gameState) {
        let serveInfoX = gameCanvas.width - 300;
        let serveInfoY = gameCanvas.height - 184;
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(serveInfoX, serveInfoY, 280, 140, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "24px \"Verdana\"";
        ctx.textBaseline = "alphabetical";
        ctx.textAlign = "left";
        ctx.fillText("Serve Time", serveInfoX + 20, serveInfoY + 20);
        ctx.fillText("Score", serveInfoX + 20, serveInfoY + 90);
        ctx.textAlign = "right";
        ctx.fillText(gameState.getServeTimeString(), serveInfoX + 260, serveInfoY + 50);
        ctx.fillText(gameState.getScore(), serveInfoX + 260, serveInfoY + 120);
    }

    renderCustomerRequest(gameCanvas, ctx, dt, gameState) {
        let matchLabelX = 100;
        let matchLabelY = gameCanvas.height / 2 - 40;
        ctx.fillStyle = Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(matchLabelX, matchLabelY, 230, 80, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "36px \"Verdana\"";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Match:", matchLabelX + 20, matchLabelY + 40);

        ctx.beginPath();
        ctx.roundRect(matchLabelX + 155, matchLabelY + 5, 70, 70, 15);
        ctx.fill();

        ctx.fillStyle = Colors.coffeeColor(gameState.getTargetProportion());  
        ctx.beginPath();
        ctx.roundRect(matchLabelX + 160, matchLabelY + 10, 60, 60, 10);
        ctx.fill();
    }

    onClick(event) {
        if (this.isPaused())
            return this.pauseScreen.onClick(event);
        return super.onClick(event);
    }

    setHovered(event) {
        if (this.isPaused()) {
            this.pauseScreen.setHovered(event);
            return;
        }
        super.setHovered(event);
    }

    onKeyDown(event) {
        if (this.isPaused()) {
            this.pauseScreen.onKeyDown(event);
            return;
        }
        if (this.gameStateHandler.getGameState())
            this.gameStateHandler.getGameState().onKeyDown(event);
    }

    onKeyUp(event) {
        if (this.isPaused()) {
            this.pauseScreen.onKeyUp(event);
            return;
        }
        if (this.gameStateHandler.getGameState())
            this.gameStateHandler.getGameState().onKeyUp(event);
    }

    isPaused() {
        return this.gameStateHandler.getGameState() && this.gameStateHandler.getGameState().isPaused();
    }

}
