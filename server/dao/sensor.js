// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn = require("./connection.js");

var getLatestSensorData = function (sensorId, limit) {
	return conn.getLatestSensorRawData(sensorId, limit);
};

var getSensorDataBoundary = function (sensorId) {
	return Promise.join(
		conn.getSensorPayloadLowerBound(sensorId),
		conn.getSensorPayloadUpperBound(sensorId),
		function (lowerBound, upperBound) {
			return {
				lower: lowerBound[0].payload,
				upper: upperBound[0].payload
			};
		});
};

module.exports = {
	latestTemporalView: function (sensorId, limit) {
		var lowerBound, upperBound;
		return Promise.join(
			getSensorDataBoundary(sensorId),
			getLatestSensorData(sensorId, limit),
			function (bound, series) {
				var timestamps = _.map(series, 
					function (item) {
						return item["timestamp"];
					});
				// Format result
				// A standard temporal view json format:
				// - valueBound: upperbound and lowerbound for values
				// - data: a list of data in chronological order, 
				//         every item in the list is a json,
				// - temporalKeys: a list of keys of the data that needs 
				//                 temporal visualization
				// - detailKeys: a list of keys of the data that needs 
				//               detail visualization
				// - timestamps: a list of timestamps
				return Promise.resolve({
					valueBound: [bound.lower, bound.upper],
					data: series,
					temporalKeys: ["payload"],
					detailKeys: ["sensorId", "desc", "payload", "deviceId", "created"],
					timestamps: timestamps
				});
		});
	}
};