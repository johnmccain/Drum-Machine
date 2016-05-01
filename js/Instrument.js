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
function Instrument(buffers, knobs, gain) //has array of knobs, array of buffers, array of sequence, and eventually a gainnode with associated volume knob
{
	//An array of the buffers of this instrument
	this.buffers = buffers;

	//Sequence represents the sequence of beats that this instrument should be played on.  Valid values for each of the 16 beats are 0 (rest), 1 (note), and 2 (emphasised note)
	this.sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	//An array of the knobs of this instrument (the first knob should be in the first index)
	this.knobs = knobs;

	this.gain = gain;

	//The current buffer
	this.buffer = {};
	this.updateBuffer();
}

Instrument.prototype =
{
	/**
	 * Updates the current buffer based on the current settings of the knobs
	 */
	updateBuffer:function()
	{
		var bufferIndex = getBufferIndex(this.getKnobSettings());
		//console.log('Updating buffer to index ' + bufferIndex);
		this.buffer = this.buffers[bufferIndex];
	},

	/**
	 * Returns an array of the current knob settings
	 * @return arr - An array of the current knob settings.
	 */
	getKnobSettings:function()
	{
		var arr = [];
		//console.log('Getting knob settings for ' + this.knobs.length + ' knobs.');
		for(var i = 0; i < this.knobs.length; i++)
		{
			arr[i] = this.knobs[i].getValue();
		}
		return arr;
	}
}

/**
 * Returns the index for the buffer indicated by the given settings
 * @param {Array} arr - An array of the knob positions (from 0 to 4) with the first knob in the first index and so on
 * @return {number} index - The index of the buffer for the given settings
 */
function getBufferIndex(arr)
{
	var index = 0;
	for(var i = 0; i < arr.length; i++)
	{
		//console.log('buffer index counting: ' + i + '; index is ' + index);
		index += arr[i] * Math.pow(5, arr.length - 1 -i);
	}
	return index;
}
