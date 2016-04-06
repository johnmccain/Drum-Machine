/**
 * Toggles the color of the beat button pressed and calls changeBeat
 *
 */
function onBeatClick(beat)
{
  var myId = 'id' + (beat + 1);
  var led = document.getElementById(myId);
  led.classList.toggle("ledOn");
  led.classList.toggle("ledOff");
  changeBeat(beat);
}
