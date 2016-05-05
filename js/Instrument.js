/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @version 1.0
 */

/**
 * Represents an Instrument.
 * @constructor
 * @param {Array} buffers - The possible AudioBufferSourceNodes for this instrument
 * @param {Array} knobs - The knobs that control parameters (aside from volume) for this instrument
 * @param {GainNode} gain - The gain node for this instrument
 */
function Instrument(buffers, knobs, gain, gainKnob) //has array of knobs, array of buffers, array of sequence, and eventually a gainnode with associated volume knob
{
    //An array of the buffers of this instrument
    this.buffers = buffers;

    //Sequence represents the sequences of beats that this instrument should be played on.  Valid values for each of the 16 beats are 0 (rest) and 1 (note)
    this.sequence = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    //An array of the knobs of this instrument (the first knob should be in the first index)
    this.knobs = knobs;

    this.gain = gain;

    this.gainKnob = gainKnob;

    //The current buffer
    this.buffer = {};
    this.updateBuffer();
}

Instrument.prototype = {
    /**
     * Updates the current buffer based on the current settings of the knobs
     */
    updateBuffer: function() {
        var bufferIndex = getBufferIndex(this.getKnobSettings());
        //console.log('Updating buffer to index ' + bufferIndex);
        this.buffer = this.buffers[bufferIndex];
    },

    /**
     * Returns an array of the current knob settings
     * @return arr - An array of the current knob settings.
     */
    getKnobSettings: function() {
        var arr = [];
        for (var i = 0; i < this.knobs.length; i++) {
            arr[i] = this.knobs[i].getValue();
        }
        return arr;
    },

    /**
     * Sets the knob settings based on an array of values in the same form as getKnobSettings returns
     * @param arr {Array} - The array of values
     */
    setKnobSettings: function(arr) {
        for (var i = 0; i < this.knobs.length; i++) {
            if(this.knobs[i].getType() == 'knob') {
                this.knobs[i].position = arr[i] * 72 + 36;
                this.knobs[i].visRotate(0);
            }
            else {
                //param is a switch
                this.knobs[i].value = arr[i];
                this.knobs[i].update();
            }
        }
    },

    /**
     * Returns a simple object representation of the instrument's current state
     * For use with JSON.stringify for debugging and saving states.
     * @return obj - An object representing the instrument
     */
    toObject: function() {
        var obj = {};
        obj.knobs = this.getKnobSettings();
        obj.gain = this.gain.gain.value;
        obj.sequence = this.sequence;
        return obj;
    },

    /**
     * Loads knob settings, gain level, and sequences from an object
     * @param obj {object} - The object to load from (must be in the form returned by Instrument.toObject)
     */
    fromObject: function(obj) {
        this.gain.gain.value = obj.gain;
        this.gainKnob.position = obj.gain * 300;
        this.gainKnob.visRotate(0);
        this.sequence = obj.sequence;
        this.setKnobSettings(obj.knobs);
    }
}

/**
 * Returns the index for the buffer indicated by the given settings
 * @param {Array} arr - An array of the knob positions (from 0 to 4) with the first knob in the first index and so on
 * @return {number} index - The index of the buffer for the given settings
 */
function getBufferIndex(arr) {
    var index = 0;
    for (var i = 0; i < arr.length; i++) {
        index += arr[i] * Math.pow(5, i);
    }
    return index;
}
