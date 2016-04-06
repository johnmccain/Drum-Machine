//NOTE: This file is a version of this file modified to handle 2d arrays of buffers: http://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js
function MyBufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array([]);
  this.loadCount = 0;
  this.loadMax = 0;

  for(var i = 0; i < this.urlList.length; ++i)
  {
    for(var j = 0; j < this.urlList[i].length; ++j)
    {
      ++this.loadMax;
    }
  }

}

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

MyBufferLoader.prototype.load = function() {
  for(var i = 0; i < this.urlList.length; ++i)
  {
    this.bufferList[i] = new Array();
    for(var j = 0; j < this.urlList[i].length; ++j)
    {
      this.loadBuffer(this.urlList[i][j], i, j);
    }
  }
}
