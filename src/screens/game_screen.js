import { BaseScreen } from "./screen.js";
import { PauseScreen } from "./pause_screen.js";
import { Button } from "../gui/button.js";
import * as Assets from "../asset_index.js";
import * as Colors from "../colors.js";


export class MainGameplayScreen extends BaseScreen {
    
    constructor(screenSetter) {
        super(screenSetter);

        this.paused = false;
        this.pauseScreen = new PauseScreen(screenSetter, this);
        
        const gameCanvas = document.getElementById("gameCanvas");
        this.addWidget(new Button("||", 20, 20, 60, 60, event => {
            this.setPaused(true);
        }));
    }

    render(gameCanvas, ctx) {
        ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
        super.render(gameCanvas, ctx);
        if (this.paused)
            this.pauseScreen.render(gameCanvas, ctx);
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
