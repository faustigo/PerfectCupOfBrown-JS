import * as AssetLoading from "./asset_loading.js";

AssetLoading.resetAssetRegistry();
export const COUNTER_BG = AssetLoading.registerImageAsset(new Image(), "./src/assets/counter.jpg");
AssetLoading.endAssetRegistry();

export function getLoadProgress() {
    return AssetLoading.getLoadProgress();
}
