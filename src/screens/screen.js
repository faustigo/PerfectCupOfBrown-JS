export class BaseScreen {

    constructor(screenSetter) {
        this.screenSetter = screenSetter;
        this.widgets = [];
    }

    addWidget(widget) {
        this.widgets.push(widget);
    }

    render(gameCanvas, ctx) {
        for (let idx in this.widgets)
            this.widgets[idx].render(gameCanvas, ctx);
    }

    onClick(event) {
        for (let idx in this.widgets) {
            if (this.widgets[idx].onClick(event))
                break;
        }
    }

    setHovered(event) {
        for (let idx in this.widgets)
            this.widgets[idx].setHovered(event);
    }

}
