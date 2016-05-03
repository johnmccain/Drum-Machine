/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @version 1.0
 */

/**
 * Creates a switch, defaulting to the low state (off)
 * @param {object} element - The element to turn into a switch
 * @constructor
 */
function FlipSwitch(element) {
    this.value = 0;

    this.element = element;

    this.element.className = "switch switchOff";

    //Create a div for an indicator
    var indicator = document.createElement('div');
    indicator.className = 'switch-indicator';
    this.element.appendChild(indicator);
}

/**
 * Returns the integer for the value the knob should represent (from 0-4)
 * @return {object} knob - the element object of the div that is the knob
 */
FlipSwitch.prototype.getValue = function() {
    return this.value;
}

/**
 * Flips the switch value from 0 to 1 or 1 to 0
 */
FlipSwitch.prototype.flip = function() {
    this.value = (this.value + 1) % 2;
    $(this.element).toggleClass('switchOff');
    $(this.element).toggleClass('switchOn');
    console.log('flipped');
}

/**
 * Makes an element into a switch
 * @param {object} mySwitch
 */
function switchify(mySwitch) {
    var jswitch = new FlipSwitch(mySwitch);
    $(mySwitch).data('jswitch', jswitch);
    mySwitch.onclick = function() {
        jswitch.flip()
    };
}

/**
 * Makes a new switch
 * @return {object} mySwitch - the element of the created switch
 */
function makeSwitch() {
    var mySwitch = document.createElement('div');
    var jswitch = new FlipSwitch(mySwitch);
    $(mySwitch).data('jswitch', jswitch);
    mySwitch.onclick = function() {
        jswitch.flip()
    };
    return mySwitch;
}
