/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @version 1.0
 */

/**
 * @type {AudioContext}
 */
var audioContext;

/**
 * The currently selected instrument for editing
 * @type {object}
 */
var currentInstrument;

/**
 * Array of all the instruments
 * @type {array}
 */
 var instruments = Array();

 /**
  * Timer for each beat
  * @type {Timer}
  */
var myTimer;

/**
 * Beat iterator (valid values are integers from 0-15)
 * @type {number}
 */
var beat = 0;

window.addEventListener('load', setup, false);

/**
 * Loads the buffers, sets up the instruments, creates the knobs, and sets the current instrument to the BD
 */
function setup()
{
  try
  {
    myTimer = new Timer(function(){onBeat();}, (60/140));

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
 * @param {number} index - The index of the instrument to select
 */
function selectInstrument(index)
{
  currentInstrument = instruments[index];
  updateLeds();
}

/**
 * Increment the sequence of the currentInstrument at index (will always be between 0-1, eventually 0-2)
 * @param {number} index - The index of the sequence to change (valid values are 1-15)
 */
function changeBeat(index)
{
  currentInstrument.sequence[index] = (currentInstrument.sequence[index] + 1) % 2;
}

/**
 * Plays the input buffer
 * @param {buffer} buffer - The buffer to play
 */
function playSound(buffer)
{
  sample = audioContext.createBufferSource();
  sample.buffer = buffer;
  sample.connect(audioContext.destination);
  sample.start(0);
}

/**
 * Starts a timer for playback
 */
function start()
{
  myTimer.start();
  beat = 0;
}

/**
* Stops the timer for playback
*/
function stop()
{
  myTimer.stop();
}

/**
 * Plays the instruments that are set to play during the current beat and increments the beat
 */
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
