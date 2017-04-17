// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn = require("./connection.js");

var testEmail    = 'yzg963@gmail.com', 
	testPassword = 'yzg134530';

var getUsers = function (token) {
	return conn.getUsers(token).catch(
			function (err) {
				console.log('Warn\tInvalid or expired token, reobtaining new token ...');
				return conn.requestAccessToken(testEmail, testPassword);
		}).then(
			function (userInfo) {
				console.log('Info\tNew token has been obtained.');
				token = userInfo.token;
				return conn.getUsers(token);
		});
};

var getProjects = function (token) {
	return conn.getAllProjects(token).catch(
			function (err) {
				console.log('Warn\tInvalid or expired token, reobtaining new token ...');
				return conn.requestAccessToken(testEmail, testPassword);
		}).then(
			function (userInfo) {
				console.log('Info\tNew token has been obtained.');
				token = userInfo.token;
				return conn.getAllProjects(token);
		})
};

module.exports = {
	usersGroup: function (token) {
		return getUsers(token);
	},
	projectsGroup: function (token) {
		return getProjects(token);
	}
};