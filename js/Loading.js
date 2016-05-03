var loadCount = 0;

var loadTotal = 128;

/**
 * Increments the loading progress meter
 */
function incrementLoadingProgress() {
    console.log('Loading progress: ' + (++loadCount));
    document.getElementById('loading-percent').innerHTML = (loadCount * 100 / loadTotal).toFixed(0);
    document.getElementById('loading-bar-fill').style.width = (loadCount * 100 / loadTotal).toFixed(0) + '%';

    if (loadCount == loadTotal) {
        window.setTimeout(onLoadFinish, 500, false);
    }
}

/**
 *
 */
function onLoadFinish() {
    document.getElementById('loading-screen').style.display = 'none';
}
