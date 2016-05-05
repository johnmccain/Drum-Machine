/**
 * @author Alan Wang
 */

function TapTempo() {
    this.timeStore = [];
    this.firstTime = 0;
    this.secondTime = 0;
    this.timetoStore = 0;

    //this checks which variable to add the click time to (firstTime or secondTime)
    this.firstBool = true;

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

        if (this.timeStore.length <= 1) {} else if (this.timeStore.length < 5) {
            for (var i = 0; i < this.timeStore.length; ++i) {
                totalTime = totalTime + this.timeStore[i];
            }
            avgTime = totalTime / this.timeStore.length;
            deviationCorrect = true;
            newTapTempo = (1 / (avgTime / 1000) * 60);
            setTempo(newTapTempo);
        } else {
            while (!deviationCorrect) {
                if (deviationCount == 0) {
                    deviationCorrect = true;
                }

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

                if (avgTime > avgTimePriority + (3 * standardDeviationPriority) || avgTime < avgTimePriority - (3 * standardDeviationPriority)) {
                    this.timeStore.splice(0, this.timeStore.length - 6);
                    deviationCount++;
                }
                for (var i = 0; i < (this.timeStore.length - 6); ++i) {
                    if (this.timeStore[i] > avgTime + (2.3 * standardDeviation) || this.timeStore[i] < avgTime - (2.3 * standardDeviation)) {
                        this.timeStore.splice(i, 1);
                        deviationCount++;
                    }
                }
                newTapTempo = (1 / (avgTime / 1000) * 60);
            }
            (newTapTempo < 240) ? newTapTempo: 239;
            setTempo(newTapTempo);
            jTempoKnob.position = (newTapTempo - 40) * 1.8;
            jTempoKnob.rotate(0);
        }
    }
}
