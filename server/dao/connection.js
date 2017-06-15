// Data type:
// -

var rp = require('request-promise');
const util = require('util');
// Activate it when debugging
// rp.debug = true

var firstsOptions = function (filterString, token) {
	return {
		uri: 'http://cloud.mageia.me/leaniot/Firsts',
		method: 'GET',
	    qs: {
			filter: filterString
		},
	    headers: {
	        'Accept': 'application/json',
	        'Authorization': 'JWT ' + token
	    },
	    json: true // Automatically parses the JSON string in the response
	};
};

module.exports = {
	requestAccessToken: function (email, password) {
		var options = {
			uri: 'http://mageia.me/api/1.0.0/token/obtain/',
			method: 'POST',
			body: {
		        email: email,
		        password: password
		    },
		    headers: {
		        'Accept': 'application/json'
		    },
		    json: true
		};
		return rp(options);
	},

	getUsers: function (token) {
		var options = {
			uri: 'http://mageia.me/api/1.0.0/users/',
			method: 'GET',
			headers: {
				'Authorization': 'JWT ' + token
			},
			json: true
		};
		return rp(options);
	},

	getAllProjects: function (token) {
		var options = {
			uri: 'http://mageia.me/api/1.0.0/projects/',
			method: 'GET',
			headers: {
				'Authorization': 'JWT ' + token
			},
			json: true
		};
		return rp(options);
	},

	getOneSensor: function (token, sensor_id) {
		var options = {
			uri: util.format('http://mageia.me/api/1.0.0/sensors/%s/', sensor_id),
			method: 'GET',
		    headers: {
		        'Authorization': 'JWT ' + token
		    },
		    json: true
		};
		return rp(options);
	},

	getOneDevice: function (token, device_id) {
		var options = {
			uri: util.format('http://mageia.me/api/1.0.0/devices/%s/', device_id),
			method: 'GET',
		    headers: {
		        'Authorization': 'JWT ' + token
		    },
		    json: true
		};
		return rp(options);
	},

	// getSensorsByPage: function (token, device_id, page) {
	// 	var options = {
	// 		uri: util.format('http://mageia.me/api/1.0.0/sensors/%s/?page=%s', device_id, page),
	// 		method: 'GET',
	// 	    headers: {
	// 	        'Authorization': 'JWT ' + token
	// 	    },
	// 	    json: true
	// 	};
	// 	return rp(options);
	// },

	getOneProject: function (token, project_id) {
    const options = {
     	uri: util.format('http://mageia.me/api/1.0.0/projects/%s/', project_id),
     	method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      },
      json: true
    };
    return rp(options);
	},

	// *******************************************************
	// Stores in Firsts, which is a document-oriented Database
	// *******************************************************
	getSensorPayloadLowerBound: function (token, sensor_id) {
		var filterString = util.format(
			'{"limit": 1, \
			"fields": {"payload": true}, \
			"order": "payload ASC", \
			"where": { \
			"sensor_id": "%s"}}', sensor_id);
		return rp(firstsOptions(filterString, token));
	},

	getSensorPayloadUpperBound: function (token, sensor_id) {
		var filterString = util.format(
			'{"limit": 1, \
			"fields": {"payload": true}, \
			"order": "payload DESC", \
			"where": {"sensor_id": "%s"}}', sensor_id);
		return rp(firstsOptions(filterString, token));
	},

	getLastSensorRawData: function (token, sensor_id) {
		var filterString = util.format(
			'{"limit": 1, \
			"order": "timestamp DESC", \
			"where": {"sensor_id": "%s"}}', sensor_id);
		return rp(firstsOptions(filterString, token));
	},

	getLatestSensorRawData: function (token, sensor_id, limit) {
		var filterString = util.format(
			'{"limit": %s, \
			"order": "timestamp DESC", \
			"where": {"sensor_id": "%s"}}', limit, sensor_id);
		return rp(firstsOptions(filterString, token));
	},

	getSensorRawDataWithinWindows: function (token, sensor_id, start_t, end_t, min_v, max_v) {
		var filterString = util.format(
			'{"limit": 1000, \
			"order": "timestamp", \
			"where": { \
			"sensor_id": "%s", \
			"timestamp": {"between": [%s, %s]}, \
			"payload": {"between": [%s, %s]}}}',
			sensor_id, start_t, end_t, min_v, max_v);
		return rp(firstsOptions(filterString, token));
	},

	getSensorRawDataWithinTimeWindow: function (token, sensor_id, start_t, end_t) {
		var filterString = util.format(
			'{"limit": 1000, \
			"order": "timestamp", \
			"where": { \
			"sensor_id": "%s", \
			"timestamp": {"between": [%s, %s]}}}',
			sensor_id, start_t, end_t);
		return rp(firstsOptions(filterString, token));
	}
};
