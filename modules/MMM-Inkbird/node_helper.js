var NodeHelper = require("node_helper");
var exec = require('child_process').exec;

const DATA_HND = 0x24;

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting node helper: " + this.name);
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'CONFIG') {
			this.config = payload;
			this.sendTemperature();
			setInterval(() => {
				this.sendTemperature();
			}, this.config.updateInterval);
		}
	},

	sendTemperature: function() {
		exec("/usr/bin/gatttool -b 49:42:08:00:6D:8A --adapter=hci0 --char-read --handle=0x24", (error, stdout, stderr) => {
			if (error) {
				console.log(error);
			} else {
				// Characteristic value/descriptor: aa 00 08 22 00 a5 7a 
				var value = stdout.replace('Characteristic value/descriptor: ','');
				value = value.replaceAll(' ','');
				console.log("MMM-Inkbird | " + value);
				var buffer = Buffer.from(value, 'hex');
				var temp = buffer.readInt16LE(0) / 100;
				var humidity = buffer.readInt16LE(2) / 100;
				console.log("MMM-Inkbird | " + temp + "C, " + humidity + "%");

				this.sendSocketNotification('INKBIRD-TEMPERATURE', {temp: temp, humidity: humidity});
			}
		});
	}
});
