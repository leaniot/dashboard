// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn    = require("./connection.js");

var testEmail    = 'yzg963@gmail.com', 
	testPassword = 'yzg134530';
	
// var getLatestSensorData = function (sensorId, limit) {
// 	return conn.getLatestSensorRawData(sensorId, limit);
// };

var getSensorDataBoundary = function (token, sensorId) {
	return Promise.join(
		conn.getSensorPayloadLowerBound(token, sensorId),
		conn.getSensorPayloadUpperBound(token, sensorId),
		function (lowerBound, upperBound) {
			return {
				lower: lowerBound[0].payload,
				upper: upperBound[0].payload
			};
		});
};

module.exports = {
	latestTemporalView: function (token, sensorId, limit) {
		var lowerBound, upperBound;
		return Promise.join(
			getSensorDataBoundary(token, sensorId),
			conn.getLatestSensorRawData(token, sensorId, limit),
			function (bound, series) {
				var timestamps = _.map(series, 
					function (item) {
						return item.timestamp;
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
	},
	cropTemporalView: function (sensorId, startTime, endTime, minValue, maxValue) {
		return conn.getSensorRawDataWithinWindows(
			sensorId, startTime, endTime, minValue, maxValue
			).then(
				function (series) {
					var timestamps = _.map(series, 
						function (item) {
							return item["timestamp"];
						}),
						boundChain = _.chain(series)
							.map(function (item) { 
								return item.payload; 
							}),
						lowerBound = boundChain.min().value(),
						upperBound = boundChain.max().value();
					return Promise.resolve({
						valueBound: [lowerBound, upperBound],
						data: series,
						temporalKeys: ["payload"],
						detailKeys: ["sensorId", "desc", "payload", "deviceId", "created"],
						timestamps: timestamps
					});
			});
	}
};