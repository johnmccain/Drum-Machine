var audioContext;

var myBuffer = null;

window.addEventListener('load', init, false);

function setup() {
  try 
  {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
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
    context.decodeAudioData(
    	request.response, 
    	function(buffer) 
	    {
	      myBuffer = buffer;
	    }, 
	    onError);
  }

  request.send();
}

function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}