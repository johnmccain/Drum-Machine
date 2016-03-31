/**
 * Represents a knob.
 * @constructor
 * @param {string} color - The color of the knob, in hex code
 * @param {Element object} knob - The Element object of this knob (should be a div)
 */
function Knob(color, element)
{
  this.element = element;

  //The position in degrees.  Should always be between 0-359
  this.position = 0;

  //The color of the knob in hex code
  this.color = color;

  //Used for keeping reference of original click when changing value.  Always set to null when not in click mode
  this.startPosition = null;

  //Used to store the change in degrees for a knobClick event.  Always set to 0 unless in the midst of a rotation
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

Knob.prototype =
{
  /**
   * Changes the position of this knob by deg degrees, accounting for rollover and rollunder so that the value of position is always between 0 and 359 (inclusive)
   * @param {int} deg - The number of degrees to rotate the knob by
   */
  rotate:function(deg)
  {
    this.position = (((this.position + (deg * .5)) % 360) + 360) % 360;  //Guarantees that change is between 0 and 359 (inclusive)
    this.visRotate(0); // Updates visual rotation to current position
  },

  /**
   * Changes the visual position of this knob from the current position by deg degrees
   * @param {number} deg - The number of degreest to visually rotate the knob by
   */
  visRotate:function(deg)
  {

    var pos = (((this.position + (deg * .5)) % 360) + 360) % 360;
    this.element.style.webkitTransform = "rotate(" + pos + "deg)"; /* Chrome, Safari, Opera */
    this.element.style.transform = "rotate(" + pos + "deg);"

    //uncomment this to display position (for testing)
    //document.getElementById('test').innerHTML = pos;
  },

  /**
   * Handle a mouseon event for a knob, rotating the knob by the change in vertical position of the mouse while the knob is held down
   * @param {number} deg - The number of degrees to twist the knob by
   */
  knobClick:function(firstEvent)
  {
    firstEvent.preventDefault();
    var me = this;
    $(document).on('mousemove', function knobDrag(myEvent)
    {
      me.startPosition = firstEvent.screenY;
      console.log("drag detected");
      if(typeof(me.startPosition) != 'undefined') //we have mouse context
      {
        me.delta = me.startPosition - myEvent.screenY;
        me.visRotate(me.delta);
      }
      else
      {
        console.log("mousemove without startPosition set")
      }
    });

    $(document).on('mouseup', function knobRelease(myEvent)
    {
      $(document).off('mousemove');
      $(document).off("mouseup");
      me.rotate(me.delta);
      me.delta = 0;
      me.startPosition = null;
    });
  }
}

/**
 * Creates a knob and returns the element object of the div that is the knob
 * @param {string} color - (optional) The color of the knob as a hex code (ex: '#FFDD44').  Defaults to # if no value is given
 * @return {element object} knob - the element object of the div that is the knob
 */
function makeKnob(color)
{
  var myColor = color || '#FFFFFF';
  var knob = document.createElement('div');
	var jknob = new Knob(myColor, knob);
	knob.onmousedown = function(myEvent){jknob.knobClick(myEvent)};
  $(knob).data('jknob', jknob);  //This enables access to the javascript object knob via the html dom element object using the jquery .data feature
  return knob;
}

/**
 * Creates a knob from an existing html element
 * @param {element object} - the element to knobbify
 * @param {string} color - (optional) The color of the knob as a hex code (ex: '#FFDD44').  Defaults to # if no value is given
 */
function knobbify(knob, color)
{
  var myColor = color || '#FFFFFF';
  var jknob = new Knob(myColor, knob);
  knob.onmousedown = function(myEvent){jknob.knobClick(myEvent)};
  $(knob).data('jknob', jknob);  //This enables access to the javascript object knob via the html dom element object using the jquery .data feature
  return knob;
}

//look into worker threads
