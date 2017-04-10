// NOTE: 
// Require `server.js` as in any node.js app to 
// get access the app object.
var app     = require("../server"),
	_       = require("underscore"),
	Promise = require("bluebird");

var conn = require("./connection.js");

var getProjectProfile = function (projectId) {
	// TODO: Considet to add limit and skip for this method
	return conn.getProjectBasicInfo(projectId);
};

module.exports = {
	profileView: function (projectId) {
		return getProjectProfile(projectId);
	}
};