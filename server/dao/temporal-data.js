// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app = require('../server'),
	_   = require('underscore');

var query_limit = 100;

var getSensorData = function () {
	app.models.sensorData.Test().then(
		function (res) {
			console.log(res);
		},
		function (err) {
			console.log(err);
		}
	);
};

module.exports = {
	test: getSensorData
};