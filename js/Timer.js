/**
 * @author John McCain <johnm.freestate@gmail.com>
 * @author Alan Wang
 * @version 1.0
 */

/**
 * Represents a timer.
 * @constructor
 * @param {function} callback - The function to call on an interval
 * @param {number} interval - The time interval (in ms) the function should be called on
 */
function Timer(callback, interval) {
    /**
     * The function to call at the specified interval
     * @type {function}
     */
    this.callback = callback;

    /**
     * The interval to call the callback function on
     * @type {number}
     */
    this.interval = interval;

    var me = this;

    /**
     * The interval timer used by this Timer
     * @type {IntervalTimer}
     */
    this.tickTimer = window.setInterval(function() {
        me.onTick(me);
    }, 1);

    /**
     * The current running state of the Timer
     * @type {boolean}
     */
    this.running = false;
}

Timer.prototype = {
    /**
     * Starts the Timer if it is not already running
     */
    start: function() {
        if (!this.running) {
            this.running = true;
            this.target = (window.performance.now() || window.performance.webkitNow());
        }
    },

    /**
     * Stops the timer
     */
    stop: function() {
        this.running = false;
    },

    /**
     * Sets the interval of the callback
     * @param {number} interval - The new interval of the timer
     */
    setInterval: function(interval) {
        this.interval = interval;
    },

    /**
     * Handles the interval call that happens every millisecond.  Should only be called by the window.
     * @param {Timer} myTimer - A reference to the timer this onTick belongs to
     */
    onTick: function(myTimer) {
        if (myTimer.running) {
            var now = (window.performance.now() || window.performance.webkitNow());
            if (now >= myTimer.target) {
                myTimer.callback();
                myTimer.target = myTimer.target + myTimer.interval;
            }
        }
    }
}
