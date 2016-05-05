/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @version 1.0
 */

/**
 * Creates a switch, defaulting to the low state (off)
 * @param {object} element - The element to turn into a switch
 * @constructor
 */
function Switch(element) {
    this.value = 0;

    this.element = element;

    this.element.className = "switch switchOff";

    //Create a div for an indicator
    var indicator = document.createElement('div');
    indicator.className = 'switch-indicator';
    this.element.appendChild(indicator);
}

/**
 * Called when the value of the Switch changes
 */
Switch.prototype.onValueChange = function() {

}

/**
 * Returns the integer for the value the knob should represent (from 0-4)
 * @return {object} knob - the element object of the div that is the knob
 */
Switch.prototype.getValue = function() {
    return this.value;
}

/**
 * Flips the switch value from 0 to 1 or 1 to 0
 */
Switch.prototype.flip = function() {
    this.value = (this.value + 1) % 2;
    this.onValueChange();
    $(this.element).toggleClass('switchOff');
    $(this.element).toggleClass('switchOn');
}

/**
 * Updates the current switch styling based on value
 */
Switch.prototype.update = function() {
    if (this.value == 1) {
        $(this.element).removeClass('switchOff');
        $(this.element).addClass('switchOn');
    } else {
        $(this.element).addClass('switchOff');
        $(this.element).removeClass('switchOn');
    }
}

/**
 * Returns the type of this object (switch)
 * @return {string} - 'switch';
 */
Switch.prototype.getType = function() {
    return 'switch';
}

/**
 * Makes an element into a switch
 * @param {object} mySwitch
 */
function switchify(mySwitch) {
    var jswitch = new Switch(mySwitch);
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
    var jswitch = new Switch(mySwitch);
    $(mySwitch).data('jswitch', jswitch);
    mySwitch.onclick = function() {
        jswitch.flip()
    };
    return mySwitch;
}
