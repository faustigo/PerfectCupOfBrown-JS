export class BaseScreen {

    constructor(screenSetter) {
        this.screenSetter = screenSetter;
        this.widgets = [];
    }

    addWidget(widget) {
        this.widgets.push(widget);
    }

    render(gameCanvas, ctx) {
        for (var i = 0; i < this.widgets.length; ++i)
            this.widgets[i].render(gameCanvas, ctx);
    }

    onClick(event) {
        for (var i = 0; i < this.widgets.length; ++i) {
            if (this.widgets[i].onClick(event))
                break;
        }
    }

    setHovered(event) {
        for (var i = 0; i < this.widgets.length; ++i)
            this.widgets[i].setHovered(event);
    }

    clearHovering() {
        for (var i = 0; i < this.widgets.length; ++i)
            this.widgets[i].setHoveredDirect(false);
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
    }

}
