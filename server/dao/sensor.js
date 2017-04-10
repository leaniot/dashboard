// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn = require("./connection.js");

var query_limit = 100;

var getLatestSensorData = function (sensor_id, limit) {
	return conn.getLatestSensorRawData(sensor_id, limit);
};

var getSensorDataBoundary = function (sensor_id) {
	return Promise.join(
		conn.getSensorPayloadLowerBound(sensor_id),
		conn.getSensorPayloadUpperBound(sensor_id),
		function (lower_bound, upper_bound) {
			return {
				lower: lower_bound[0].payload,
				upper: upper_bound[0].payload
			};
		});
};

module.exports = {
	latestTemporalView: function (sensor_id, limit) {
		var lower_bound, upper_bound;
		return Promise.join(
			getSensorDataBoundary(sensor_id),
			getLatestSensorData(sensor_id, limit),
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
					detailKeys: ["sensor_id", "desc", "payload", "device_id", "created"],
					timestamps: timestamps
				});
		});
	}
};