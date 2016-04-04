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
      [
        "TR808WAV/BD/BD0000.WAV",
        "TR808WAV/BD/BD0010.WAV",
        "TR808WAV/BD/BD0025.WAV",
        "TR808WAV/BD/BD0050.WAV",
        "TR808WAV/BD/BD0075.WAV",
        "TR808WAV/BD/BD0075.WAV",
        "TR808WAV/BD/BD1000.WAV",
        "TR808WAV/BD/BD1010.WAV",
        "TR808WAV/BD/BD1025.WAV",
        "TR808WAV/BD/BD1050.WAV",
        "TR808WAV/BD/BD1075.WAV",
        "TR808WAV/BD/BD2500.WAV",
        "TR808WAV/BD/BD2510.WAV",
        "TR808WAV/BD/BD2525.WAV",
        "TR808WAV/BD/BD2550.WAV",
        "TR808WAV/BD/BD2575.WAV",
        "TR808WAV/BD/BD5000.WAV",
        "TR808WAV/BD/BD5010.WAV",
        "TR808WAV/BD/BD5025.WAV",
        "TR808WAV/BD/BD5050.WAV",
        "TR808WAV/BD/BD5075.WAV",
        "TR808WAV/BD/BD7500.WAV",
        "TR808WAV/BD/BD7510.WAV",
        "TR808WAV/BD/BD7525.WAV",
        "TR808WAV/BD/BD7550.WAV",
        "TR808WAV/BD/BD7575.WAV"
      ],
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
