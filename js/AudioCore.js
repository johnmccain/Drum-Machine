var audioContext;

var instruments = [];

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

    bufferLoader = new BufferLoader
      (
      audioContext,
      [
        "TR808WAV/BD/BD5050.WAV",
        "TR808WAV/SD/SD5050.WAV",
        "TR808WAV/LT/LT50.WAV",
        "TR808WAV/MT/MT50.WAV",
        "TR808WAV/HT/HT50.WAV",
        "TR808WAV/RS/RS.WAV",
        "TR808WAV/CP/CP.WAV",
        "TR808WAV/CB/CB.WAV",
        "TR808WAV/CY/CY5050.WAV",
        "TR808WAV/OH/OH50.WAV",
        "TR808WAV/CH/CH.WAV"
      ],
      makeInstruments
      );

    bufferLoader.load();
  }
  catch(exception)
  {
    console.trace();
    console.log(exception);
    alert("HTML5 audio is not supported in your browser.");
  }
}

function makeInstruments(buffers)
{
  for(var i = 0; i < buffers.length; i++)
  {
    instruments[i] = new Instrument(buffers[i]);
  }
}

function playSound(buffer)
{
  sample = audioContext.createBufferSource();
  sample.buffer = buffer;
  sample.connect(audioContext.destination);
  sample.start(0);
}

function start()
{
  beatTimer = window.setInterval(onBeat, 200);
  beat = 0;
}
function stop()
{
  window.clearInterval(beatTimer);
}

function testSequence()
{
  instruments[0].sequence = [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0]; //BD beat
  instruments[1].sequence = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]; //SD beat
  instruments[7].sequence = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]; //CH beat
  instruments[10].sequence = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //CH beat
}

function onBeat()
{
  for(var i = 0; i < instruments.length; i++)
  {
    if(instruments[i].sequence[beat] > 0)
    {
      playSound(instruments[i].buffer);
    }
  }
  beat = (beat + 1) % 16;
}
