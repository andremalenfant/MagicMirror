Module.register("MMM-Inkbird",{

	defaults: {
		prependString: 'Inkbird temperature: ',
		updateInterval: 20 * 1000,
		animationSpeed: 0,
		unit: 'c',
		warning: { temp: 60, color: 'orange', command: undefined },
		critical:  { temp: 75, color: 'red', command: { notification: 'REMOTE_ACTION', payload: { action: 'SHUTDOWN' } } },
		displayData: true,
	},

	getStyles: function () {
	  return ["MMM-Inkbird.css", "font-awesome.css"];
	},
	
	getScripts: function () {
	  return [`modules/${this.name}/node_modules/lodash/lodash.js`];
	},	

	start: function() {
		this.sendSocketNotification('CONFIG', this.config);
		this.config.unit = this.config.unit && this.config.unit.toLowerCase();
		this.commandExecutor = this.getCommandExecutor();
	},

	roundedToFixed: function(input, digits) {
  		var rounded = Math.pow(10, digits);
  		return (Math.round(input * rounded) / rounded).toFixed(digits);
	},

	socketNotificationReceived: function(notification, payload) {
	    if (notification === 'INKBIRD-TEMPERATURE') {
	    	this.hasData = true;
			this.temperature = payload.temp;//this.roundedToFixed(parseFloat(payload.temp),1);
			this.humidity = this.roundedToFixed(parseFloat(payload.humidity),1);
			this.stateConfig = this.getStateConfigByTemperature() || {};
			this.updateDom(this.config.animationSpeed);
			this.commandExecutor();
			this.sendNotification('INKBIRD-TEMPERATURE', payload);
	    }
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		if (this.config.displayData) {
			if (this.hasData) {
				wrapper.innerHTML = this.config.prependString + this.getTemperatureLabel();
				wrapper.style.color = this.stateConfig.color || "";
			} else {
				wrapper.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.translate("LOADING")}`;
			}
		}
		return wrapper;
	},

	getTemperatureLabel: function() {
		return `<span class="temperatureLabel">
					<span class="temperatureValue">${this.getConvertedTemperature()}</span> 
					<span class="temperatureUnit">${this.config.unit.toUpperCase()}</span>
					<span class="temperatureValue">${this.humidity}%</span> 
				</span>`;
	},

	getStateConfigByTemperature: function() {
		if (this.config.critical && this.temperature >= this.config.critical.temp) {
			return this.config.critical;
		} else if (this.config.warning && this.temperature >= this.config.warning.temp) {
			return this.config.warning;
		}
	},

	getConvertedTemperature: function() {
		if (this.temperature && this.config.unit !== 'c') {
			var convertedTemperature;
			if (this.config.unit === 'f') {
				convertedTemperature = this.temperature * 9 / 5 + 32;
			} else if (this.config.unit === 'k') {
				convertedTemperature = this.temperature - 273.15;
			}
			// Round off the temperature to 2 decimal places
			return Math.round(convertedTemperature * 100) / 100;
		}
		return this.temperature;
	},

	getCommandExecutor: function() {
		return _.throttle(() => {
			if (this.stateConfig && this.stateConfig.command) {
				const command = this.stateConfig.command;
				this.sendNotification(command.notification, command.payload);
			}
		}, this.config.updateInterval * 5, { leading: false, trailing: true });
	}

});
