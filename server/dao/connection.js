// Data type:
// - 

var rp = require('request-promise');
const util = require('util');
// rp.debug = true

var regular_options = function (filterString) {
	return {
		uri: 'http://cloud.mageia.me/leaniot/Firsts',
		method: 'GET',
	    qs: {
			filter: filterString
		},
	    headers: {
	        'Accept': 'application/json'
	    },
	    json: true // Automatically parses the JSON string in the response
	};
};

module.exports = {
	getProjectBasicInfo: function (project_id) {
		var options = {
				uri: util.format('http://mageia.me/api/1.0.0/projects/%s/', project_id),
				method: 'GET',
			    headers: {
			        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Inl6Zzk2M0BnbWFpbC5jb20iLCJleHAiOjE0OTE4OTU5NjYsInVzZXJuYW1lIjoieXpnOTYzQGdtYWlsLmNvbSIsInVzZXJfaWQiOiJKZ05yZ1JoR2hyeWlFMk5HUDdIeWg3In0.VbG0XPXqI5gspg-U-j2o8YDpwC5Fj9dr3Sq6uqyX8wA'
			    },
			    json: true // Automatically parses the JSON string in the response
			};
		return rp(options);
	},
	getSensorPayloadLowerBound: function (sensor_id) {
		var filterString = util.format(
			'{"limit": 1, \
			"fields": {"payload": true}, \
			"order": "payload ASC", \
			"where": { \
			"sensor_id": "%s"}}', sensor_id);
		return rp(regular_options(filterString));
	},

	getSensorPayloadUpperBound: function (sensor_id) {
		var filterString = util.format(
			'{"limit": 1, \
			"fields": {"payload": true}, \
			"order": "payload DESC", \
			"where": {"sensor_id": "%s"}}', sensor_id);
		return rp(regular_options(filterString));
	},

	getLastSensorRawData: function (sensor_id) {
		var filterString = util.format(
			'{"limit": 1, \
			"order": "timestamp DESC", \
			"where": {"sensor_id": "%s"}}', sensor_id);
		return rp(regular_options(filterString));
	},

	getLatestSensorRawData: function (sensor_id, limit) {
		var filterString = util.format(
			'{"limit": %s, \
			"order": "timestamp DESC", \
			"where": {"sensor_id": "%s"}}', limit, sensor_id);
		return rp(regular_options(filterString));
	},

	getSensorRawDataWithinWindows: function (sensor_id, start_t, end_t, min_v, max_v) {
		var filterString = util.format(
			'{"limit": 1000, \
			"order": "timestamp", \
			"where": { \
			"sensor_id": "%s", \
			"timestamp": {"between": [%s, %s]}, \
			"payload": {"between": [%s, %s]}}}', 
			sensor_id, start_t, end_t, min_v, max_v);
		return rp(regular_options(filterString));
	}
};