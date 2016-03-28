/**
 * Represents an Instrument.
 * @constructor
 * @param {arraybuffer} buffer - The starting arraybuffer (audio sample) for this Instrument
 */
function Instrument(buffer) //eventually has array of knobs, array of buffers, and a gainnode with associated volume knob
{
	//Sequence represents the sequence of beats that this instrument should be played on.  Valid values for each of the 16 beats are 0 (rest), 1 (note), and 2 (emphasised note)
	this.sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.buffer = buffer;
	console.log('Set Instrument buffer');
}
