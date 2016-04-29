 function TapTempo(){
     this.timeStore = [];
     this.firstTime = 0;
     this.secondTime = 0;
     this.timetoStore = 0;
     
     //this checks which variable to add the click time to (firstTime or secondTime)
     this.firstBool = true;
     
     this.timing = function(){
         
         //first click value
         if (this.firstTime == 0 && this.secondTime == 0)
		 {
			 this.firstTime = window.performance.now();
			 firstBool = false;
		 }
		 else if (!firstBool)
		 {
			 this.secondTime = window.performance.now();
                         this.timetoStore = this.secondTime - this.firstTime;
                         
                         //reset if too much time has passed
                         if (this.timetoStore >= 2000)
                         {
                             this.firstTime = 0;
                             this.secondTime = 0;
                             var emptyArray = [];
                             this.timeStore = emptyArray;
                             
                         }
                         else
                         {
			 this.timeStore.push(this.timetoStore);
			 firstBool = true;
                         }
		 }
		 else if (firstBool)
		 {
			 this.firstTime = window.performance.now();
                         this.timetoStore = this.firstTime - this.secondTime;
                         
                         //reset if too much time has passed
                         if (this.timetoStore >= 2000)
                         {
                             this.firstTime = 0;
                             this.secondTime = 0;
                             var emptyArray = [];
                             this.timeStore= emptyArray;
                             
                         }
                         else
                         {
			 this.timeStore.push(this.timetoStore);
			 firstBool = false;
                         }
		 }
                this.calculateTempo();
                 
     }
     this.calculateTempo = function(){
         
         var newTapTempo = 0;
         
         //time calc variables
         var avgTime = 0;
         var totalTime = 0;
         
         //std calc variables
         var standardDeviation = 0;
         var stdInstance = 0;
         
         //booolean to check if tempo still needs to be recalculated for while loop
         var deviationCorrect = false;
         var deviationCount = 0;

             while (!deviationCorrect)
             {
                    if (this.timeStore.length <= 5)
                    {
                        for (var i = 0; i<this.timeStore.length; ++i)
                        {
                            totalTime = totalTime + this.timeStore[i];
                        }
                        avgTime = totalTime/this.timeStore.length;
                        deviationCorrect = true;
                    }
                    else
                    {
                        
                        if (deviationCount == 0)
                        {
                            deviationCorrect = true;
                        }
                        for (var i = 0; i<this.timeStore.length; ++i)
                        {
                            totalTime = totalTime + this.timeStore[i];
                        }
                        avgTime = totalTime/this.timeStore.length;
                        
                        
                        for (var i=0; i<this.timeStore.length; ++i)
                        {
                            stdInstance = (this.timeStore[i] - avgTime)*(this.timeStore[i] - avgTime);
                            standardDeviation = standardDeviation + stdInstance;
                        }
                        standardDeviation = standardDeviation/this.timeStore.length;
                        
                        standardDeviation = Math.sqrt(standardDeviation);
                        
                        
                        deviationCount = 0;
                        
                        
                        for (var i=0; i<(this.timeStore.length-2); ++i)
                        {
                            if (this.timeStore[i] > avgTime + (2*standardDeviation) || this.timeStore[i] < avgTime - (2*standardDeviation))
                            {
                                this.timeStore.splice (i, 1);
                                deviationCount ++;file:///home/awang/public_html
                            }
                        }
                        

                    }
             }
             
             newTapTempo = (1/(avgTime/1000)*60);
             setTempo(newTapTempo);
             
     }
 }
                            
                            
            
             
         
