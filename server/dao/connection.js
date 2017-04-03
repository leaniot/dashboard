// Data type:
// - 

var rp = require('request-promise');
const util = require('util');
rp.debug = true

module.exports = {
	getSensorRawDataWithinWindows: function (
		project_id, device_id, sensor_id, // an unique sensor indicator
		start_t, end_t,                   // time window
		min_v, max_v                      // value window
	) {
		var filter_string = util.format(
			'{"limit": 1, "order": "timestamp", \
			"where": { "project_id": "%s", \
			"device_id":  "%s", \
			"sensor_id":  "%s", \
			"timestamp": {"between": [1490607000000, 1590607000000]}, \
			"payload": {"between": [30000000, 80000000]}}}', 
			project_id, device_id, sensor_id, 
			start_t, end_t, min_v, max_v
		);
		var options = {
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
		// Get sensor raw data within indicated time window and value window
		return rp(options)
			.then(function (repos) {
	        	console.log(repos);
	    	})
	    	.catch(function (err) {
	    		console.log(err);
	    	});
	},
};