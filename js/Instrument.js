/**
 * Represents an Instrument.
 * @constructor
 * @param {arraybuffer array} buffers - The possible buffers for this instrument
 * @param {knob array} knobs - The knobs that control parameters (aside from volume) for this instrument
 */
function Instrument(buffers, knobs) //has array of knobs, array of buffers, array of sequence, and eventually a gainnode with associated volume knob
{
	this.buffers = buffers;
	//Sequence represents the sequence of beats that this instrument should be played on.  Valid values for each of the 16 beats are 0 (rest), 1 (note), and 2 (emphasised note)
	this.sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.knobs = knobs;

	this.buffer = {};

	this.updateBuffer();
	//console.log('Set Instrument buffer');
}

Instrument.prototype =
{
	updateBuffer:function()
	{
		var bufferIndex = getBufferIndex(this.getKnobSettings());
		//console.log('Updating buffer to index ' + bufferIndex);
		this.buffer = this.buffers[bufferIndex];
	},

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
 * @param {int array} arr - An array of the knob positions (from 0 to 4) with the first knob in the first index and so on
 * @return {int} index - The index of the buffer for the given settings
 */
function getBufferIndex(arr)
{
	var index = 0;
	for(var i = 0; i < arr.length; i++)
	{
		//console.log('buffer index counting: ' + i + '; index is ' + index);
		index += arr[i] * Math.pow(5, arr.length - 1 -i);
	}
	$('#bufferNo')[0].innerHTML = index;
	return index;
}
