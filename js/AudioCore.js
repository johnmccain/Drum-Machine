var audioContext;

var instrument;

//Timer for each beat
var beatTimer;

var beat = 0;

window.addEventListener('load', setup, false);

function setup()
{
  try
  {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    /* knobs */
    var channel = document.getElementById('channel');

    console.log('got channel');
    var knob1 = makeKnob('#FF5555');
    var knob2 = makeKnob('#5555FF');

    channel.appendChild(knob1);
    channel.appendChild(knob2);
    //console.log('Made the knobs');

    var knobs = [$(knob1).data('jknob'), $(knob2).data('jknob')];

    /* buffers */
    bdLoader = new BufferLoader
      (
      audioContext,
      BDBufferList,
      function(buffers)
      {
        instrument = new Instrument(buffers, knobs);
        testSequence();
        start();
      }
      );
    bdLoader.load();
  }
  catch(exception)
  {
    console.trace();
    console.log(exception);
    alert("HTML5 audio is not supported in your browser.");
  }
}

/*
function makeInstruments(buffers)
{
  for(var i = 0; i < buffers.length; i++)
  {
    instruments[i] = new Instrument(buffers[i]);
  }
}
*/

function playSound(buffer)
{
  sample = audioContext.createBufferSource();
  sample.buffer = buffer;
  sample.connect(audioContext.destination);
  sample.start(0);
}

function start()
{
  beatTimer = window.setInterval(onBeat, 400);
  beat = 0;
}
function stop()
{
  window.clearInterval(beatTimer);
}

function testSequence()
{
  instrument.sequence = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //BD beat
  /*
  instruments[1].sequence = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]; //SD beat
  instruments[7].sequence = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]; //CH beat
  instruments[10].sequence = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //CH beat
  */
}

function onBeat()
{
  if(instrument.sequence[beat] > 0)
  {
    playSound(instrument.buffer);
  }

  instrument.updateBuffer();

  beat = (beat + 1) % 16;
}
