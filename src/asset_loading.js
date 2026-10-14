let ASSETS_TO_LOAD_COUNTER = 0;
let ASSETS_LOADED_COUNTER = 0;

/**
 * Call when marking a new section of assets to register.
 */
export function resetAssetRegistry() {
    ASSETS_TO_LOAD_COUNTER = 0;
    ASSETS_LOADED_COUNTER = 0;
}

/**
 * Call when ending a section of assets to register.
 */
export function endAssetRegistry() {
}

/**
 * Use where a custom loading routine is used.
 * Do not use if asset does not require loading.
 */
export function registerAsset(asset) {
    ++ASSETS_TO_LOAD_COUNTER;
    return asset;
}

export function registerImageAsset(image, src) {
    image.src = src;
    registerAsset(image);
    const wrappedOnLoad = image.onload;
    image.onload = () => {
        if (wrappedOnLoad)
            wrappedOnLoad();
        ++ASSETS_LOADED_COUNTER;
    };
    return image;
}

/**
 * Returns: [<to load count>, <loaded count>]
 */
export function getLoadProgress() {
    return [ASSETS_TO_LOAD_COUNTER, ASSETS_LOADED_COUNTER];
}
