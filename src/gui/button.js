import { Widget } from "./widget.js"; 

const COFFEE_BROWN_TEXT = "#6F4E37";
const COFFEE_BROWNER_TEXT = "#4F2E17";

export class Button extends Widget {

    constructor(text, x, y, width, height, clickCallback = null, textFont = "36px \"Verdana\"") {
        super(x, y, width, height, clickCallback);
        this.text = text;
        this.textFont = textFont;
    }

    render(gameCanvas, ctx) {
        ctx.fillStyle = this.isHovered() ? COFFEE_BROWNER_TEXT : COFFEE_BROWN_TEXT;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = this.textFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

}
