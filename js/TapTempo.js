/**
 * @author Alan Wang
 */


/**
 * The Tap Tempo constructor
 * @constructor
 */
function TapTempo() {

    /**
     * stores the time between taps
     * @type {Array}
     */
    this.timeStore = [];

    /**
     * The time the first tap was clicked, overridden on odd numbered taps
     * @type {number}
     */
    this.firstTime = 0;

    /**
     * The time the second tap was clicked, overridden on even numbered taps
     * @type {number}
     */
    this.secondTime = 0;

    /**
     * The actual time to push into the array. (difference between tap times).
     * @type {number}
     */
    this.timetoStore = 0;

    /**
     * This checks which variable to add the click time to (firstTime or secondTime)
     * @type {boolean}
     */
    this.firstBool = true;

    /**
     * Times when the tap button or hotkey is pressed, finds which difference to use then pushes it to *timeStore, and calls calculateTempo()
     */
    this.timing = function() {
        //first click value
        if (this.firstTime == 0 && this.secondTime == 0) {
            this.firstTime = window.performance.now();
            firstBool = false;
        } else if (!firstBool) {
            this.secondTime = window.performance.now();
            this.timetoStore = this.secondTime - this.firstTime;

            //reset if too much time has passed
            if (this.timetoStore >= 2000) {
                this.firstTime = 0;
                this.secondTime = 0;
                var emptyArray = [];
                this.timeStore = emptyArray;

            } else {
                this.timeStore.push(this.timetoStore);
                firstBool = true;
            }
        } else if (firstBool) {
            this.firstTime = window.performance.now();
            this.timetoStore = this.firstTime - this.secondTime;

            //reset if too much time has passed
            if (this.timetoStore >= 2000) {
                this.firstTime = 0;
                this.secondTime = 0;
                var emptyArray = [];
                this.timeStore = emptyArray;

            } else {
                this.timeStore.push(this.timetoStore);
                firstBool = false;
            }
        }
        this.calculateTempo();
    }

    /**
     * Calculates the correct tempo from the values stored in timeStore
     */
    this.calculateTempo = function() {

        var newTapTempo = 0;

        //time calc variables

        //time calc for first 8 values
        var avgTimePriority = 0;
        var totalTimePriority = 0;

        //time calc for all values
        var avgTime = 0;
        var totalTime = 0;

        //std calc variables

        //std calc for first 8 values
        var standardDeviationPriority = 0;
        var stdInstancePriority = 0;

        //std calc for all values
        var standardDeviation = 0;
        var stdInstance = 0;

        //booolean to check if tempo still needs to be recalculated for while loop
        var deviationCorrect = false;
        var deviationCount = 0;

        //as long as there is more than one time stored in timeStore and less than 4 values to calculate
        if (this.timeStore.length <= 1) {} else if (this.timeStore.length < 5) {

            //calculates average time
            for (var i = 0; i < this.timeStore.length; ++i) {
                totalTime = totalTime + this.timeStore[i];
            }
            avgTime = totalTime / this.timeStore.length;

            //breaks out of the loop
            deviationCorrect = true;

            //converts the average time between taps and converts it into a tempo
            newTapTempo = (1 / (avgTime / 1000) * 60);

            //sets the new tempo
            setTempo(newTapTempo);
        } else {
            while (!deviationCorrect) {
                //breaks out of loop if nothing was removed from the array.
                if (deviationCount == 0) {
                    deviationCorrect = true;
                }

                //Gives priority to the first 5 values
                for (var i = this.timeStore.length - 6; i < this.timeStore.length; ++i) {
                    totalTimePriority = totalTimePriority + this.timeStore[i];
                }
                avgTimePriority = totalTimePriority / 5;

                for (var i = this.timeStore.length - 6; i < this.timeStore.length; ++i) {
                    stdInstancePriority = (this.timeStore[i] - avgTimePriority) * (this.timeStore[i] - avgTimePriority);
                    standardDeviationPriority = standardDeviationPriority + stdInstancePriority;
                }
                standardDeviationPriority = standardDeviationPriority / 5;

                standardDeviationPriority = Math.sqrt(standardDeviationPriority);


                //calculations for the rest of the array
                for (var i = 0; i < this.timeStore.length; ++i) {
                    totalTime = totalTime + this.timeStore[i];
                }
                avgTime = totalTime / this.timeStore.length;


                for (var i = 0; i < this.timeStore.length; ++i) {
                    stdInstance = (this.timeStore[i] - avgTime) * (this.timeStore[i] - avgTime);
                    standardDeviation = standardDeviation + stdInstance;
                }
                standardDeviation = standardDeviation / this.timeStore.length;

                standardDeviation = Math.sqrt(standardDeviation);


                deviationCount = 0;


                //checks to see if the first 5 value avg is too different from the total average
                if (avgTime > avgTimePriority + (3 * standardDeviationPriority) || avgTime < avgTimePriority - (3 * standardDeviationPriority)) {
                    //if values differ by 3 stds, remove everything except first 5 values.
                    this.timeStore.splice(0, this.timeStore.length - 6);
                    deviationCount++; //if a value is removed, keep going through the loop
                }

                //remove outliers.
                for (var i = 0; i < (this.timeStore.length - 6); ++i) {
                    if (this.timeStore[i] > avgTime + (2.3 * standardDeviation) || this.timeStore[i] < avgTime - (2.3 * standardDeviation)) {
                        this.timeStore.splice(i, 1);
                        deviationCount++; //if a value is removed, keep going through the loop
                    }
                }
                newTapTempo = (1 / (avgTime / 1000) * 60);
            }

            //applies limits on tempo then rotates the knob accordingly.
            (newTapTempo < 240) ? newTapTempo: 239;
            newTapTempo = (newTapTempo < 240) ? newTapTempo : 239;
            setTempo(newTapTempo);
            jTempoKnob.position = (newTapTempo - 40) * 1.8;
            jTempoKnob.rotate(0);
        }
    }
}
