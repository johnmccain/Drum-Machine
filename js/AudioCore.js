var audioContext;

//The currently selected instrument for editing
var currentInstrument;

//All of the instruments
var instruments = Array();

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

    /* buffers */
    loader = new MyBufferLoader
      (
      audioContext,
      BufferLists,
      function(buffers)
      {
        for(var i = 0; i < buffers.length; ++i)
        {
          /* knobs */
          var numKnobs = 0;
          for(var x = 0; x >= 0; ++x)
          {
            if(Math.pow(5, x) <= buffers[i].length)
            {
              numKnobs = x;
            }
            else
            {
              x = -100;
            }
          }

          var knobs = Array();
          for(var j = 0; j < numKnobs; ++j)
          {
            var knob = makeKnob('#FF5555');
            knobs[j] = $(knob).data('jknob');
            $(channels[i]).prepend($(knob).fadeIn('fast'));
          }
          console.log('Made ' + numKnobs + ' knobs.  Actual length of knobs: ' + knobs.length);
          //Create the instrument
          instruments[i] = new Instrument(buffers[i], knobs);
        }

        currentInstrument = instruments[0];
      }
      );
    loader.load();
  }
  catch(exception)
  {
    console.trace();
    console.log(exception);
    alert("HTML5 audio is not supported in your browser.");
  }
}

/**
 * Change the currentInstrument to the instrument at index in instruments
 * @param {int} index - the index of the instrument to select
 */
function selectInstrument(index)
{
  currentInstrument = instruments[index];
  updateLeds();
}

/**
 * Increment the sequence of the currentInstrument at index (will always be between 0-1, eventually 0-2)
 * @param {int} index - the index of the sequence to change (valid values are 1-15)
 */
function changeBeat(index)
{
  currentInstrument.sequence[index] = (currentInstrument.sequence[index] + 1) % 2;
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
  instruments[1].sequence = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]; //SD beat
  instruments[7].sequence = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]; //CH beat
  instruments[10].sequence = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; //CH beat
}

function onBeat()
{
  for(var i = 0; i < instruments.length; ++i)
  {
    if(instruments[i].sequence[beat] > 0)
    {
      playSound(instruments[i].buffer);
    }
    instruments[i].updateBuffer();
  }

  beat = (beat + 1) % 16;
}
