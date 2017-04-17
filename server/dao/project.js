// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn = require("./connection.js");

var testEmail    = 'yzg963@gmail.com', 
	testPassword = 'yzg134530';

var getProjectProfile = function (token, projectId) {
	// TODO: Considet to add limit and skip for this method
	// return conn.requestAccessToken(testEmail, testPassword);
	return conn.getOneProject(token, projectId).catch(
			function (err) {
				console.log('Warn\tInvalid or expired token, reobtaining new token ...');
				return conn.requestAccessToken(testEmail, testPassword);
		}).then(
			function (userInfo) {
				console.log('Info\tNew token has been obtained.');
				token = userInfo.token;
				return conn.getOneProject(token, projectId);
		});
};

module.exports = {
	profileView: function (token, projectId) {
		return getProjectProfile(token, projectId);
	}
};