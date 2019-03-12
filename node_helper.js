var NodeHelper = require("node_helper");
const Vitadock = require("./lib/dataRetrieval.js");

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		//console.log("Notification received: " + notification);
		if (notification === "ADD_VITADOCK") {
			//console.log("ADD_VITADOCK: ");
			this.createFetcher(payload); // payload = config
		}
	},

	sortByMeasurementDate: function(a, b) {
		if (a.measurementDate < b.measurementDate) {
			return -1;
		} else if(a.measurementDate > b.measurementDate) {
			return 1;
		} else if(a.measurementDate === b.measurementDate) {
			return 0;
		} else {
			throw "Can not compare data";
		}
	},

	createFetcher: function(config) {
		var self = this;

		Vitadock.getData(config.credentials, "targetscales", function(success, data) {
			if(!success) {
				console.log("Unable to retrieve Vitadock targetscales data: ", data);
				return;
			}

			data = data.sort(self.sortByMeasurementDate);
			//console.log("VITADOCK_TARGETSCALES");
			self.sendSocketNotification("VITADOCK_TARGETSCALES", {
				id: config.credentials.oauthToken,
				data: data,
			});
		});
		//*/

		/*data.forEach( function(row) {
			console.log(new Date(row.measurementDate) + ": " + row.bodyWeight + "kg " + row.bodyFat + "%");
		});*/

	},
});
