/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @version 1.0
 */

/**
 * The DOM Element objects of each led, indexed by beat
 * @type {Array}
 */
var leds = Array();

for (var i = 0; i < 16; ++i) {
    var myId = 'id' + (i + 1);
    leds[i] = document.getElementById(myId);
}

/**
 * The DOM Element objects of each instrument channel, indexed by order on the screen from left to right
 * @type {Array}
 */
var channels = Array();

for (var i = 0; i < 16; ++i) {
    var myId = 'i' + (i + 1);
    channels[i] = document.getElementById(myId);
}

/**
 * The DOM Element objects of each sequnce mode button
 * @type {Array}
 */
var modeButtons = [document.getElementById('sequenceA'), document.getElementById('sequenceB'), document.getElementById('sequenceAB')];

/**
 * Toggles the color of the beat button pressed and calls changeBeat
 * @param {number} beat - the beat of the button that was pressed (from 0-15)
 */
function onBeatClick(beat) {
    leds[beat].classList.toggle("ledOn");
    leds[beat].classList.toggle("ledOff");
    changeBeat(beat);
}

/**
 * Sets the sequenceMode
 * @param {number} mode - 0 for A, 1 for B, 2 for AB
 */
function setSequenceMode(mode) {
    modeButtons[mode].classList.add('on');
    modeButtons[(mode + 1) % 3].classList.remove('on');
    modeButtons[(mode + 2) % 3].classList.remove('on');
    sequenceMode = mode;
    onSequenceModeChange();
}

/**
 * Updates the leds to show current beat positions.
 */
function onBeatChange() {
    leds[beat].classList.add("ledBeat");
    leds[(beat - 1 < 0 ? 15 : beat - 1)].classList.remove("ledBeat");
}

/**
 * Clears the beat indicator.
 */
function clearBeatIndicator() {
    leds[(beat - 1 < 0 ? 15 : beat - 1)].classList.remove("ledBeat");
}

/**
 * Updates the Leds to reflect the current state of the selected instrument's sequence
 */
function updateLeds() {
    for (var i = 0; i < 16; ++i) {
        if (currentInstrument.sequence[sequenceNumber][i] > 0) {
            //led should be on
            leds[i].classList.remove("ledOff");
            leds[i].classList.add("ledOn");
        } else {
            //led should be off
            leds[i].classList.remove("ledOn");
            leds[i].classList.add("ledOff");
        }
    }
}

/**
 * An array of all the instrument control elements
 * @type {array}
 */
var controls = [
    [document.getElementById('BDDecay'), document.getElementById('BDTone')],
    [document.getElementById('SDSnappy'), document.getElementById('SDTone')],
    [document.getElementById('LTuning'), document.getElementById('LSwitch')],
    [document.getElementById('MTuning'), document.getElementById('MSwitch')],
    [document.getElementById('HTuning'), document.getElementById('HSwitch')],
    [document.getElementById('RSSwitch')],
    [document.getElementById('CPSwitch')],
    [],
    [document.getElementById('CYDecay'), document.getElementById('CYTone')],
    [document.getElementById('OHDecay')],
    []
];
