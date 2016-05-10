/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @author Alan Wang
 * @version 1.0
 */

/**
 * Represents a knob.
 * @constructor
 * @param {string} color - The color of the knob, in hex code
 * @param {object} knob - The Element object of this knob (should be a div)
 */
function Knob(color, element) {

    /**
     * The DOM element that parallels this knob
     * @type {element}
     */
    this.element = element;

    /**
    * The position in degrees.  Should always be between 0-359
    * @type {number}
    */
    this.position = 180;

    /**
     * The color of the knob in hex code
     * @type {string}
     */
    this.color = color;

    /**
     * Used for keeping reference of original click when changing value.  Always set to null when not in click mode
     * @type {null | number}
     */
    this.startPosition = null;

    /**
     * Used to store the change in degrees for a knobClick event.  Always set to 0 unless in the midst of a rotation
     * @type {number}
     */
    this.delta = 0;

     //Set styling stuff for a knob
    this.element.style.backgroundColor = this.color;

    //Set the className for styling purposes
    this.element.className += ' knob';

    //this.element.addEventListener('mousedown', function(myEvent){this.knobClick});

    //Create a div for an indicator
    var indicator = document.createElement('div');
    indicator.className = 'knobIndicator';
    this.element.appendChild(indicator);
}

Knob.prototype = {
    /**
     * Called after rotate() is called to handle any actions that should occur upon a change in knob value
     */
    onValueChange: function() {

    },

    /**
     * Returns the type of this object (knob)
     * @return {string} - 'knob';
     */
    getType() {
        return 'knob';
    },

    /**
     * Changes the position of this knob by deg degrees, accounting for rollover and rollunder so that the value of position is always between 0 and 359 (inclusive)
     * @param {number} deg - The number of degrees to rotate the knob by
     */
    rotate: function(deg) {
        this.position = (((this.position + (deg * .5)) % 360) + 360) % 360; //Guarantees that change is between 0 and 359 (inclusive)
        this.visRotate(0); // Updates visual rotation to current position
    },

    /**
     * Changes the visual position of this knob from the current position by deg degrees
     * @param {number} deg - The number of degreest to visually rotate the knob by
     */
    visRotate: function(deg) {

        var pos = (((this.position + (deg * .5) + 180) % 360) + 360) % 360;
        this.element.style.webkitTransform = "rotate(" + pos + "deg)"; /* Chrome, Safari, Opera */
        this.element.style.transform = "rotate(" + pos + "deg);"
    },

    mytouchmove: function(myEvent) {
        console.log('drag detected');
        if (typeof(currentKnob.startPosition) != 'undefined') //we have mouse context
        {
            currentKnob.delta = currentKnob.startPosition - myEvent.changedTouches[0].screenY;
            //console.log('Now value: ' + myEvent.changedTouches[0].screenY + '; Type: ' + typeof myEvent.changedTouches[0].screenY);
            currentKnob.visRotate(currentKnob.delta);
            console.log('Visrotated by ' + currentKnob.delta);
        } else {
            console.log('mousemove without startPosition set');
        }
    },

    /**
     * Handle a mouseon event for a knob, rotating the knob by the change in vertical position of the mouse while the knob is held down
     * @param {number} deg - The number of degrees to twist the knob by
     */
    knobClick: function(firstEvent) {
        firstEvent.preventDefault();
        var me = this;
        me.startPosition = firstEvent.screenY;
        $(document).on('mousemove', function knobDrag(myEvent) {
            console.log("drag detected");
            if (typeof(me.startPosition) != 'undefined') //we have mouse context
            {
                me.delta = me.startPosition - myEvent.screenY;
                me.visRotate(me.delta);
            } else {
                console.log("mousemove without startPosition set")
            }
        });

        $(document).on('mouseup', function knobRelease(myEvent) {
            $(document).off('mousemove');
            $(document).off("mouseup");
            me.rotate(me.delta);
            me.delta = 0;
            me.startPosition = null;
            me.onValueChange();
        });
    },

    touchStart: function(firstEvent) {
        firstEvent.preventDefault();
        currentKnob = this;
        var me = this;
        var myTouch = firstEvent.touches[0];
        me.startPosition = firstEvent.touches[0].screenY;
        console.log('Start value: ' + me.startPosition + '; Type: ' + typeof me.startPosition);
        document.addEventListener('touchmove', me.mytouchmove, false);
        $(document).on('touchend', function knobTouchRelease(myEvent) {
            console.log('Ended touch');
            document.removeEventListener('touchmove', me.mytouchmove);
            $(document).off('touchend');
            $(document).off('touchcancel');
            currentKnob = undefined;
            me.rotate(me.delta);
            me.delta = 0;
            me.startPosition = null;
            me.onValueChange();
        });
        $(document).on('touchcancel', function knobTouchCancel(myEvent) {
            document.removeEventListener('touchmove', me.touchmove);
            $(document).off('touchend');
            $(document).off('touchcancel');
            currentKnob = undefined;
            me.delta = 0;
            me.startPosition = null;
        });
    },

    /**
     * Returns the integer for the value the knob should represent (from 0-4)
     * @return {object} knob - the element object of the div that is the knob
     */
    getValue: function() {
        var val = Math.floor(this.position / 72);
        return val;
    }
}

/**
 * Creates a knob and retur=ns the element object of the div that is the knob
 * @param {string} color - (optional) The color of the knob as a hex code (ex: '#FFDD44').  Defaults to # if no value is given
 * @return {object} knob - the element object of the div that is the knob
 */
function makeKnob(color) {
    var myColor = color || '#FFFFFF';
    var knob = document.createElement('div');
    var jknob = new Knob(myColor, knob);
    knob.onmousedown = function(myEvent) {
        jknob.knobClick(myEvent)
    };
    knob.addEventListener("touchstart", function(myEvent) {
        jknob.touchStart(myEvent)
    }, false);
    $(knob).data('jknob', jknob); //This enables access to the javascript object knob via the html dom element object using the jquery .data feature
    return knob;
}

/**
 * Creates a knob from an existing html element
 * @param {object} - the element to knobbify
 * @param {string} color - (optional) The color of the knob as a hex code (ex: '#FFDD44').  Defaults to # if no value is given
 */
function knobbify(knob, color) {
    var myColor = color || '#FFFFFF';
    var jknob = new Knob(myColor, knob);
    knob.onmousedown = function(myEvent) {
        jknob.knobClick(myEvent)
    };
    knob.addEventListener("touchstart", function(myEvent) {
        jknob.touchStart(myEvent)
    }, false);
    $(knob).data('jknob', jknob); //This enables access to the javascript object knob via the html dom element object using the jquery .data feature
    return knob;
}

var currentKnob = undefined;
