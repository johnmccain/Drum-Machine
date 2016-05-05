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
var beatTimer;

/**
 * TapTempo handler
 * @type {TapTempo}
 */
var tapTempo;

/**
 * The current BPM (beats per minute) of the drum machine.  Note: a beat is 4 steps in this drum machine.
 * @type {number}
 */
var tempo;

/**
 * Knob for the tempo
 * @type {knob}
 */
var jTempoKnob;

/**
 * Beat iterator (valid values are integers from 0-15)
 * @type {number}
 */
var beat = 0;

/**
 * Gain node for the master volume
 * @type {GainNode}
 */
var masterVolume;

/**
 * Knob for the master volume
 * @type {knob}
 */
var jMasterVolumeKnob;

/**
 * The sequence mode, where 0 is for A only, 1 is for B only, and 2 is for AB
 * @type {number}
 */
var sequenceMode = 0;

/**
 * The sequence number to be played and displayed
 * @type {number}
 */
var sequenceNumber = 0;

/**
 * The object of a blank scene (used for resetting)
 * @type {object}
 */
var blankSceneObj = {"instruments":[{"knobs":[2,2],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[2,2],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[2,0],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[2,0],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[2,0],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[0],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[0],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[2,2],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[2],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"knobs":[],"gain":0.6000000238418579,"sequence":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}],"volume":0.6000000238418579,"tempo":140,"sequenceMode":0}

window.addEventListener('load', setup, false);

/**
 * Loads the buffers, sets up the instruments, creates the knobs, and sets the current instrument to the BD
 */
function setup() {
    try {
        incrementLoadingProgress();
        beatTimer = new Timer(function() {
            onBeat();
        }, 107.142857143);

        tempo = 140;

        tapTempo = new TapTempo();

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        //set up master volume gain node
        masterVolume = audioContext.createGain();
        masterVolume.connect(audioContext.destination);
        masterVolume.gain.value = .6;

        var masterVolumeKnob = document.getElementById('volume-knob');
        knobbify(masterVolumeKnob, '#5555AA');
        jMasterVolumeKnob = $(masterVolumeKnob).data('jknob');
        jMasterVolumeKnob.gainNode = masterVolume;
        jMasterVolumeKnob.getValue = function() {
            return this.position / 300;
        };
        jMasterVolumeKnob.onValueChange = function() {
            this.gainNode.gain.value = this.getValue();

        };

        //set up the tempo knob
        var tempoKnob = document.getElementById('tempo-knob');
        knobbify(tempoKnob, '#DDDDDD');
        jTempoKnob = $(tempoKnob).data('jknob');
        jTempoKnob.getValue = function() {
            return ((this.position / 1.8) + 40); //Possible values: 40-200bpm
        };
        jTempoKnob.onValueChange = function() {
            setTempo(this.getValue());
        };

        /* buffers */
        loader = new MyBufferLoader(
            audioContext,
            BufferLists,
            function(buffers) {
                createInstruments(buffers);
            }
        );
        loader.load();

        //Bind keys
        $(window).bind('keyup', function(key) {
            if (key.which == 32) {
                //Space Bar -> Play/Pause
                playPause();
                key.preventDefault();
            } else if (key.which == 65) {
                //A -> Sequence A
                setSequenceMode(0);
                key.preventDefault();
            } else if (key.which == 66) {
                //B -> Sequence B
                setSequenceMode(1);
                key.preventDefault();
            } else if (key.which == 89) {
                //Y -> Sequence AB
                setSequenceMode(2);
                key.preventDefault();
            } else if (key.which == 84) {
                //T -> Tap
                tapTempo.timing();
                key.preventDefault();
            }
        });
    } catch (exception) {
        console.trace();
        console.log(exception);
        alert("HTML5 audio is not supported in your browser.");
    }
}

/**
 * Change the currentInstrument to the instrument at index in instruments
 * @param {number} index - The index of the instrument to select
 */
function selectInstrument(index) {
    currentInstrument = instruments[index];
    updateLeds();
}

/**
 * Increment the sequence of the currentInstrument at index (will always be between 0-1, eventually 0-2)
 * @param {number} index - The index of the sequence to change (valid values are 1-15)
 */
function changeBeat(index) {
    currentInstrument.sequence[sequenceNumber][index] = (currentInstrument.sequence[sequenceNumber][index] + 1) % 2;
}

/**
 * Set the BPM of the drum machine.  Updates the current BPM, tempo knob, and the beatTimer interval if given a valid (truthy) value.
 * Note: the maximum tempo allowed is 239
 * @param {number} newTempo - The new tempo of the drum machine in beats per minute
 */
function setTempo(newTempo) {
    if (newTempo) {
        tempo = newTempo;
        beatTimer.setInterval(15000 / newTempo);
        console.log('Changed tempo to ' + tempo);
    }
}

/**
 * Called when the play/pause button is pressed or the spacebar is pressed.  Calls start() if the TR808 is stopped, calls stop() otherwise
 */
function playPause() {
    if (beatTimer.running) {
        stop();
    } else {
        start();
    }
}

/**
 * Starts the beatTimer for playback
 */
function start() {
    if (!beatTimer.running) {
        beatTimer.start();
        beat = 0;
    }
}

/**
 * Stops the beatTimer for playback
 */
function stop() {
    beatTimer.stop();
    clearBeatIndicator();
}

/**
 * Plays the input buffer
 * @param {Instrument} buffer - The instrument to play
 */
function playSound(instrument) {
    var sample = audioContext.createBufferSource();
    sample.buffer = instrument.buffer;
    sample.connect(instrument.gain);
    sample.start(0);
}

/**
 * Plays the instruments that are set to play during the current beat and increments the beat
 */
function onBeat() {
    onBeatChange();
    for (var i = 0; i < instruments.length; ++i) {
        if (instruments[i].sequence[sequenceNumber][beat] > 0) {
            playSound(instruments[i]);
        }
    }
    for (var i = 0; i < instruments.length; ++i) {
        instruments[i].updateBuffer();
    }

    beat = (beat + 1) % 16;
    if (beat == 0 && sequenceMode == 2) {
        sequenceNumber = (sequenceNumber + 1) % 2;
        updateLeds();
    }
}

/**
 * Handles all necessary operations for when the sequence mode changes
 */
function onSequenceModeChange() {
    if (sequenceMode == 0) {
        sequenceNumber = 0;
    } else if (sequenceMode == 1) {
        sequenceNumber = 1;
    }
    updateLeds();
}

/**
 * Creates the instruments and knobs
 * @param {array} buffers - the 2d array of buffers to be made into instruments
 */
function createInstruments(buffers) {
    for (var i = 0; i < buffers.length; ++i) {
        incrementLoadingProgress();
        gain = audioContext.createGain();
        gain.connect(masterVolume);
        gain.gain.value = .6;
        var gainKnob = makeKnob('#5555FF');
        var jGainKnob = $(gainKnob).data('jknob');
        jGainKnob.gainNode = gain;
        jGainKnob.getValue = function() {
            return this.position / 300;
        };
        jGainKnob.onValueChange = function() {
            this.gainNode.gain.value = this.getValue();
        };

        var myControls = Array();
        for (var j = 0; j < controls[i].length; ++j) {
            if (controls[i][j].classList == 'knob') {
                knobbify(controls[i][j], '#FF5555');
                myControls[j] = $(controls[i][j]).data('jknob');
            } else {
                switchify(controls[i][j]);
                myControls[j] = $(controls[i][j]).data('jswitch');
            }
        }
        //Create the instrument
        instruments[i] = new Instrument(buffers[i], myControls, gain, jGainKnob);

        //Set the knobs and switches to update its instrument's buffer
        for (var j = 0; j < instruments[i].knobs.length; ++j) {
            instruments[i].knobs[j].instrumentId = i;
            instruments[i].knobs[j].onValueChange = function() {
                console.log('Value changed');
                instruments[this.instrumentId].updateBuffer();
            };
        }

        $(channels[i]).prepend($(gainKnob).fadeIn('fast'));
        var gainLabel = document.createElement('p');
        gainLabel.classList = 'label';
        gainLabel.innerHTML = 'volume';
        $(channels[i]).prepend($(gainLabel).fadeIn('fast'));
    }
    currentInstrument = instruments[0];
    loadScene();
}

/**
 * Returns an object representing the current state of the drum machine (for pattern saving/sharing)
 * @return {object} obj - the object representing the current state of the drum machine
 */
function toObject() {
    var obj = {};
    var instrumentObjects = Array();
    for (var i = 0; i < instruments.length; ++i) {
        instrumentObjects[i] = instruments[i].toObject();
    }
    obj.instruments = instrumentObjects;
    obj.volume = masterVolume.gain.value;
    obj.tempo = tempo;
    obj.sequenceMode = sequenceMode;
    return obj;
}

/**
 * Pushes a get parameter to the URL, removing previous get parameters if they exist
 * @param param {string} - the parameter to push to get with key 'p'
 */
function pushGet(param) {
    var url = window.location.href;
    if (url.indexOf('?p=') > 0) {
        url = url.substring(0, url.indexOf('?p='));
    }
    window.history.pushState({
        "html": document.documentElement.outerHTML,
        "pageTitle": document.title
    }, "", url + '?p=' + param);
}

/**
 * Pulls a get parameter under key 'p' from the url
 * @return obj {object | undefined} - the object pulled from get, undefined if no object as 'p' is a get parameter or the parameter is not a valid JSON object
 */
function pullGet() {
    var url = window.location.href;
    if (url.indexOf('?p=') > 0) {
        try {
            var str = url.substring(url.indexOf('?p=') + 3, url.length).replace(/%22/g, '"');
            return JSON.parse(str);
        } catch (e) {
            console.log('Error parsing the get parameter');
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * Loads a scene (including all settings) from an object
 * @param obj {object} - the scene to load from
 */
function loadFromObject(obj) {
    if (!obj || !obj.volume) {
        console.error('Error: invalid object');
        alert('Error: invalid scene settings');
        return;
    }
    for (var i = 0; i < instruments.length; ++i) {
        instruments[i].fromObject(obj.instruments[i]);
    }
    masterVolume.gain.value = obj.volume;
    jMasterVolumeKnob.position = obj.volume * 300;
    jMasterVolumeKnob.rotate(0);
    setTempo(obj.tempo);
    setSequenceMode(obj.sequenceMode);
}

/**
 * Attempts to load a scene from a serialized jSON object in the url
 */
function loadScene() {
    var obj = pullGet();
    if (obj) {
        loadFromObject(obj);
    }
}

/**
 * Saves a scene (including all settings) to a serialized JSON object in the url
 */
function saveScene() {
    pushGet(JSON.stringify(toObject()));
}

function reset() {
    loadFromObject(blankSceneObj);

    var url = window.location.href;
    if(url.indexOf('?') > 0)
    {
        url = url.substring(0, url.indexOf('?'));
    }

    window.history.pushState({
        "html": document.documentElement.outerHTML,
        "pageTitle": document.title
    }, "", url);
}
