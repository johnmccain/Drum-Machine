/**
 * @author html5rocks
 * @author John McCain <johnm.freestate@gmail.com>
 * @version 2.0
 * NOTE: This file is a modified version of this file so it can handle 2d arrays of buffers: http://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js
 */

/**
 * Loads a 2d array of buffers from a 2d array of URLs
 * @constructor
 * @param {AudioContext} context - The AudioContext to load the buffers within
 * @param {Array} urlList - A 2d array of URLs to load.  Each primary index should be a list of the files for a particular instrument's buffers
 * @param {function} callback - The function to call upon completion
 */
function MyBufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array([]);

    //The number of buffers loaded so far. Used to keep track of when the loading is finished.
    this.loadCount = 0;

    //The total number of buffers to be loaded.  Used to keep track of when the loading is finished.
    this.loadMax = 0;

    for (var i = 0; i < this.urlList.length; ++i) {
        for (var j = 0; j < this.urlList[i].length; ++j) {
            ++this.loadMax;
        }
    }

}

/**
 * Loads an individual buffer
 * @param {string} url - The URL of the buffer to load
 * @param {number} i - The primary index (instrument index) the buffer should be placed at in the output array
 * @param {number} j - The secondary index the buffer should be placed at in the output array
 */
MyBufferLoader.prototype.loadBuffer = function(url, i, j) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[i][j] = buffer;
                incrementLoadingProgress();
                if (++loader.loadCount == loader.loadMax)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }

    request.onerror = function() {
        alert('MyBufferLoader: XHR error');
    }

    request.send();
}

/**
 * Initiates the loading process
 */
MyBufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i) {
        this.bufferList[i] = new Array();
        for (var j = 0; j < this.urlList[i].length; ++j) {
            this.loadBuffer(this.urlList[i][j], i, j);
        }
    }
}
