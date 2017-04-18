// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn = require("./connection.js");

var testEmail    = 'yzg963@gmail.com', 
	testPassword = 'yzg134530';

var getDeviceProfile = function (token, deviceId) {
	// TODO: Considet to add limit and skip for this method
	// return conn.requestAccessToken(testEmail, testPassword);
	return conn.getOneDevice(token, deviceId).catch(
			function (err) {
				console.log('Warn\tInvalid or expired token, reobtaining new token ...');
				return conn.requestAccessToken(testEmail, testPassword);
		}).then(
			function (userInfo) {
				console.log('Info\tNew token has been obtained.');
				token = userInfo.token;
				return conn.getOneDevice(token, deviceId);
		});
};

module.exports = {
	deviceView: function (token, deviceId) {
		return getDeviceProfile(token, deviceId);
	}
};