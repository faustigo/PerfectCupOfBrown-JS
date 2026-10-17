export class Widget {

    constructor(x, y, width, height, clickCallback = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.clickCallback = clickCallback;
        this.hovered = false;
        const gameCanvas = document.getElementById("gameCanvas");
    }

    render(gameCanvas, ctx) {
    }

    onClick(event) {
        if (!this.clickCallback)
            return false;
        if (this.x <= event.clientX && event.clientX < this.x + this.width && this.y <= event.clientY && event.clientY < this.y + this.height)
            return this.clickCallback(event);
        return false;
    }

    setHovered(event) {
        this.hovered = this.x <= event.clientX && event.clientX < this.x + this.width && this.y <= event.clientY && event.clientY < this.y + this.height;
    }

    isHovered() {
        return this.hovered;
    }

}
