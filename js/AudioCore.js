var audioContext;

var myBuffer = null;

window.addEventListener('load', setup, false);

function setup() {
  try
  {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    loadSound("TR808WAV/BD/BD5050.WAV");
  }
  catch(exception)
  {
    alert("HTML5 audio is not supported in your browser.");
  }
}

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function()
  {
    audioContext.decodeAudioData(
    	request.response,
    	function(buffer)
	    {
	      myBuffer = buffer;
	    }
    );
  }

  request.send();
}

function playSound(buffer) {
  var kick = audioContext.createBufferSource();
  kick.buffer = buffer;
  kick.connect(audioContext.destination);
  kick.start(0);
}
