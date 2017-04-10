// Data type:
// - 

var rp = require('request-promise');
const util = require('util');
// rp.debug = true

var regular_options = function (filter_string) {
	return {
		uri: 'http://cloud.mageia.me/leaniot/Firsts',
		method: 'GET',
	    qs: {
			filter: filter_string
		},
	    headers: {
	        'Accept': 'application/json'
	    },
	    json: true // Automatically parses the JSON string in the response
	};
};

module.exports = {
	// getProjectProfile: function (project_id) {
	// 	var filter_string = util.format(
	// 		'{"limit": 1, "order": "timestamp", \
	// 		"where": { "project_id": "%s", \
	// 		"device_id":  "%s", \
	// 		"sensor_id":  "%s", \
	// 		"timestamp": {"between": [1490607000000, 1590607000000]}, \
	// 		"payload": {"between": [30000000, 80000000]}}}', 
	// 		project_id, device_id, sensor_id, 
	// 		start_t, end_t, min_v, max_v
	// 	);
	// },
	getSensorPayloadLowerBound: function (sensor_id) {
		var filter_string = util.format(
			'{"limit": 1, \
			"fields": {"payload": true}, \
			"order": "payload ASC", \
			"where": { \
			"sensor_id": "%s"}}', sensor_id);
		return rp(regular_options(filter_string));
	},

	getSensorPayloadUpperBound: function (sensor_id) {
		var filter_string = util.format(
			'{"limit": 1, \
			"fields": {"payload": true}, \
			"order": "payload DESC", \
			"where": {"sensor_id": "%s"}}', sensor_id);
		return rp(regular_options(filter_string));
	},

	getLastSensorRawData: function (sensor_id) {
		var filter_string = util.format(
			'{"limit": 1, \
			"order": "timestamp DESC", \
			"where": {"sensor_id": "%s"}}', sensor_id);
		return rp(regular_options(filter_string));
	},

	getLatestSensorRawData: function (sensor_id, limit) {
		var filter_string = util.format(
			'{"limit": %s, \
			"order": "timestamp DESC", \
			"where": {"sensor_id": "%s"}}', limit, sensor_id);
		return rp(regular_options(filter_string));
	},

	getSensorRawDataWithinWindows: function (sensor_id, start_t, end_t, min_v, max_v) {
		var filter_string = util.format(
			'{"limit": 1000, \
			"order": "timestamp", \
			"where": { \
			"sensor_id": "%s", \
			"timestamp": {"between": [%s, %s]}, \
			"payload": {"between": [%s, %s]}}}', 
			sensor_id, start_t, end_t, min_v, max_v);
		return rp(regular_options(filter_string));
	}
};