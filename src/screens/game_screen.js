import { BaseScreen } from "./screen.js";
import { PauseScreen } from "./pause_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


export class MainGameplayScreen extends BaseScreen {
    
    hoverPct = 0.0;
    coffeeFillPct = 0.0;

    constructor(stateSetter) {
        super(stateSetter);

        this.paused = false;
        this.pauseScreen = new PauseScreen(stateSetter, this);
        
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("||", 20, 20, 60, 60, event => {
            this.setPaused(true);
        }));
    }

    render(gameCanvas, ctx, dt) {
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);

        // TODO serve animation
        let cupX = gameCanvas.width / 2;
        let cupY = 400;
        // TODO actual values from game state
        let shadePct = this.hoverPct;
        let coffeeFillPct = this.coffeeFillPct;
        let coffeeShade = Colors.coffeeColor(shadePct);
        let coffeeHeight = 205 * coffeeFillPct;
        let coffeeRadiusX = 88 + (115 - 88) * coffeeFillPct;
        let coffeeRadiusY = 73 + (95 - 73) * coffeeFillPct;

        // Draw base
        // Inside wall
        let insideGradient = ctx.createLinearGradient(cupX - 120, cupY, cupX + 120, cupY);
        insideGradient.addColorStop(0, Colors.PAPER_CUP_OFF_WHITE_1);
        insideGradient.addColorStop(1, Colors.PAPER_CUP_OFF_WHITE_3);
        ctx.fillStyle = insideGradient;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 230, 115, 100, 0, 0, Math.PI * 2);
        ctx.fill();
        // Marker
        ctx.lineWidth = 2;
        ctx.strokeStyle = Colors.PAPER_CUP_SHADE_1;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 205, 115, 95, 0, 0, Math.PI, true);
        ctx.stroke();
        // Rim, back
        ctx.lineWidth = 10;
        ctx.strokeStyle = Colors.PAPER_CUP_WHITE;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 230, 120, 100, 0, 0, Math.PI, true);
        ctx.stroke();
        
        // Draw coffee with interpolated shade
        // TODO sizing and positioning coffee correctly in accordance with game logic
        ctx.fillStyle = coffeeShade;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - coffeeHeight, coffeeRadiusX, coffeeRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw top
        // Cup body
        let outsideGradient = ctx.createLinearGradient(cupX - 120, cupY, cupX + 120, cupY);
        outsideGradient.addColorStop(0, Colors.PAPER_CUP_OFF_WHITE_1);
        outsideGradient.addColorStop(0.8, Colors.PAPER_CUP_OFF_WHITE_2);
        outsideGradient.addColorStop(1, Colors.PAPER_CUP_OFF_WHITE_3);
        ctx.fillStyle = outsideGradient;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 230, 120, 100, 0, 0, Math.PI);
        ctx.lineTo(cupX - 90, cupY);
        ctx.ellipse(cupX, cupY, 90, 75, 0, Math.PI, 0, true);
        ctx.lineTo(cupX + 120, cupY - 230);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = Colors.PAPER_CUP_OFF_WHITE_3;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 10, 90, 75, 0, 0.15, Math.PI-0.15, false);
        ctx.stroke();
        // Rim, front
        ctx.lineWidth = 10;
        ctx.strokeStyle = Colors.PAPER_CUP_OFF_WHITE_3;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 225, 120, 100, 0, 0, Math.PI, false);
        ctx.stroke();
        ctx.strokeStyle = Colors.PAPER_CUP_WHITE;
        ctx.beginPath();
        ctx.ellipse(cupX, cupY - 230, 120, 100, 0, 0, Math.PI, false);
        ctx.stroke();

        // TODO render timer

        
        // TODO render score


        // TODO render customer request
        

        super.render(gameCanvas, ctx, dt);

        if (this.paused)
            this.pauseScreen.render(gameCanvas, ctx, dt);
    }

    setPaused(paused) {
        this.paused = paused;
        if (this.paused) {
            this.clearHovering();
        } else {
            this.pauseScreen.clearHovering();
        }
    }

    onClick(event) {
        if (super.onClick(event))
            return;
        if (this.paused)
            this.pauseScreen.onClick(event);
    }

    setHovered(event) {
        if (this.paused) {
            this.pauseScreen.setHovered(event);
        } else {
            super.setHovered(event);
            // TODO remove
            this.hoverPct = event.clientX / 960;
            this.coffeeFillPct = (1 - event.clientY / 540) * (230 / 205);
        }
    }

    onKeyDown(event) {
        if (this.paused) {
            this.pauseScreen.onKeyDown(event);
            return;
        }
        if (event.keyCode === 27)
            this.setPaused(true);
    }

    onKeyUp(event) {
        if (this.paused) {
            this.pauseScreen.onKeyUp(event);
            return;
        }
    }

}
