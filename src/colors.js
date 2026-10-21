export const COFFEE_BROWN = "#6F4E37";
export const COFFEE_BROWN_HOVERED = "#4F2E17";
export const COFFEE_BROWN_PAUSED = "#8F6E57";

export const PAPER_CUP_WHITE = "#FFFFFF";
export const PAPER_CUP_OFF_WHITE_1 = "#F7F7F7";
export const PAPER_CUP_OFF_WHITE_2 = "#EFEFEF";
export const PAPER_CUP_OFF_WHITE_3 = "#DFDFDF";
export const PAPER_CUP_SHADE_1 = "#9F9F9F";

export function coffeeColor(proportionMilk) {
    // Clamp proportion
    proportionMilk = Math.min(1, Math.max(0, proportionMilk));
    let light = 5 + 95 * proportionMilk;
    return `hsl(25 34 ${light})`;
}
