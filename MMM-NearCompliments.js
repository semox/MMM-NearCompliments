/* Magic Mirror
 * Module: MMM-NearCompliments
 * 
 * By semox
 * MIT Licensed
 */

Module.register("MMM-NearCompliments", {
	defaults : {
		echoPin: "",
		triggerPin: "",
		distance: 70, // <70 cm will show compliments for given delay
		sensorTimeout: 500,
		animationSpeed: 100,
		measuringInterval: 500, // in milliseconds
		delay: 30, // 30 seconds compliments will be shown
		usePIR: false,
		powerSavingDelay: 30,
		verbose: false,
		calibrate: true,
        	autoStart: true,
	},
	  
	start: function() {
		var self = this;
		this.loaded = false;	
	
		console.log('Starting Module: ' + this.name);
		
		/* code below is only working when event is DOM_OBJECTS_CREATED fired 
		//get powerSavingDelay from MMM-PIR-Sensor
		if(this.config.usePIR){
			var pirModules = MM.getModules().withClass('MMM-PIR-Sensor');
			if(pirModules.length > 0) {
				var pirModule = pirModules[0];
				this.config.powerSavingDelay = pirModule.config.powerSavingDelay;
				console.log('powerSavingDelay of MMM-PIR module is '+ this.config.powerSavingDelay);
			} else {
				Log.warn('MMM-PIR-Sensor is configured to be used but could not be found! Please enable it!');
			}
		}
		*/
	
		if(self.config.echoPin <= 27 && self.config.triggerPin <= 27) {
			//send config to node_helper
			console.log('Sending config to node_helper');
			this.sendSocketNotification('CONFIG', this.config);
		} else {
			console.log('Improper Pin configuration.  Please use BCM Numbering');
		}
		
		//turn on measuring if usePIR is false, otherwise it is turned on when we receive USER_PRESENCE true notification
		/* is turned on later by using autoStart
		if(!this.config.usePIR){
			//begin measuring
                        this.sendSocketNotification('ACTIVATE_MEASURING', true);
		}
		*/ 

	},


	// hide compliment module by default, begin measuring distance from user if USER_PRESENCE is received (optional)
	notificationReceived: function(notification, payload, sender) {
		//loading text
		if (notification === 'DOM_OBJECTS_CREATED') {
            		this.loaded = true;
			var complimentModules = MM.getModules().withClass('compliments');

                        if(complimentModules && complimentModules.length == 1){

                                Log.info('Hiding compliment module since all modules were loaded.');
                                var compliment = complimentModules[0];
                                // compliment.hide(0, {lockString: this.name});
                                compliment.hide(0);

                        } else if (complimentModules.length < 1) {
                                Log.warn('No Compliments Module loaded. Nothing to hide!');
                        }
	
			//get powerSavingDelay from MMM-PIR-Sensor
			if(this.config.usePIR){
				var pirModules = MM.getModules().withClass('MMM-PIR-Sensor');
				if(pirModules.length > 0) {
					var pirModule = pirModules[0];
					this.config.powerSavingDelay = pirModule.config.powerSavingDelay;
					console.log('powerSavingDelay of MMM-PIR module is '+ this.config.powerSavingDelay);
                        	} else {
                                	Log.warn('MMM-PIR-Sensor is configured to be used but could not be found! Please enable it!');
                        	}
                	}
        	}
	
		// hide compliment module by default after all modules were loaded
		if (notification == 'ALL_MODULES_STARTED'){
			/* below code does not work!! has to be executed when DOM_OBJECTS_CREATED is fired
			var complimentModules = MM.getModules().withClass('compliments');
			
			if(complimentModules && complimentModules.length == 1){
			
				Log.info('Hiding compliment module since all modules were loaded.');
				var compliment = complimentModules[0];
				compliment.hide(0, {lockString: this.name});

			} else if (complimentModules.length < 1) {
                        	Log.warn('No Compliments Module loaded. Nothing to hide!');
			} */
		}
		
		//turn on measuring if USER_PRESENCE is true and if we configured to use PIR
		if (notification == 'USER_PRESENCE' && this.config.usePIR){
			if(payload == true){
				//begin measuring only for powerSavingDelay
				clearTimeout(this.deactivateMeasuring);
				this.sendSocketNotification('ACTIVATE_MEASURING', true);
				
				/* 
				var self = this;
				this.deactivateMeasuring = setTimeout(function(){
                                        self.sendSocketNotification('ACTIVATE_MEASURING', false);
                                }, this.config.powerSavingDelay * 1000);
				*/
			}
			
			if(payload == false){
				//stop measuring after powerSavingDelay is timed out
				var self = this;
				this.deactivateMeasuring = setTimeout(function(){
					self.sendSocketNotification('ACTIVATE_MEASURING', false);
				}, this.config.powerSavingDelay * 1000);
			}
		}	
		
		

	},
	
	socketNotificationReceived: function(notification, payload) {
		var complimentModules = MM.getModules().withClass('compliments');
		if (complimentModules.length > 0) {
			var compliment = complimentModules[0];
		}
		//autoStart Measuring if configured
		if (notification === 'STARTED') {
		    if (this.config.autoStart && !this.config.usePIR) {
			this.sendSocketNotification("ACTIVATE_MEASURING", true);
		    }
		}
		
		if (notification === 'CALIBRATION') {
		    this.displayData = "<table border=\"1\" cellpadding=\"5\"><tr align=\"center\"><th>Distance</td></tr><tr align=\"center\"><td>" + payload + "</td></tr></table>";
		    //this.updateDom(this.config.animationSpeed);
		    this.updateDom(0);
		} 
		
		if (notification === 'MEASUREMENT') {
		    	//this.sendNotification("SHOW_ALERT", { title: "Distance Measurement", message: payload, imageFA: "hand-paper-o", timer: 500});
			if(payload < this.config.distance) {
                                //broadcast USER_PRESENCE_NEAR: true
                                // this.sendNotification("USER_PRESENCE_NEAR", true);
				console.log('USER_PRESENCE_NEAR: true');
			}
		}


		// if (notification === 'MEASUREMENT' && compliment && compliment.hidden == true) {
		if (notification === 'MEASUREMENT' && compliment) {
			var self = this;
			var distance = payload;
			if(distance < this.config.distance) {
				clearTimeout(this.deactivateComplimentsTimeout);
				//only ask for showing when compliment is actually hidden, otherwise timeout is cleared and set again
				if(compliment.hidden == true){
    					console.log('Asking compliment module to show');
					compliment.show(self.config.animationSpeed, {lockString: this.name});
	
				}
	
				this.deactivateComplimentsTimeout = setTimeout(function(){
    					console.log('Asking compliment module to hide');
					compliment.hide(self.config.animationSpeed, {lockString: this.name});
				}, this.config.delay *1000)
			}
			
		}

	},
	
	getDom: function() {
		var wrapper = document.createElement("div");
		
		if (!this.loaded) {
		    wrapper.innerHTML = "Loading "+this.name+"...";
		    wrapper.className = "dimmed light small";
		    return wrapper;
		}
		if (this.error) {
		    wrapper.innerHTML = "Error loading data...";
		    return wrapper;
		}

		if (typeof this.displayData !== "undefined") {
		    wrapper.innerHTML = this.displayData;
		    wrapper.className = "dimmed light small";
		}
		return wrapper;
	}
});
