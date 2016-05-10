/**
 * The iterator for loading
 * @type {number}
 */
var loadCount = 0;

/**
 * The total number of things to be loaded (used to calculate percentage completed)
 * @type {number}
 */
const LOAD_TOTAL = 128;

/**
 * Increments the loading progress meter
 */
function incrementLoadingProgress() {
    ++loadCount;
    document.getElementById('loading-percent').innerHTML = (loadCount * 100 / LOAD_TOTAL).toFixed(0);
    document.getElementById('loading-bar-fill').style.width = (loadCount * 100 / LOAD_TOTAL).toFixed(0) + '%';

    if (loadCount == LOAD_TOTAL) {
        window.setTimeout(onLoadFinish, 500, false);
    }
}

/**
 * Hides the loading screen
 */
function onLoadFinish() {
    document.getElementById('loading-screen').style.display = 'none';
}
