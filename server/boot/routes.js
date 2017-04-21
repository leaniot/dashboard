var path       = require('path'),
	bodyParser = require('body-parser'),
	Promise    = require('bluebird');

var sensor  = require('../dao/sensor.js'),
	device  = require('../dao/device.js');
	project = require('../dao/project.js'),
	user    = require('../dao/user.js');

// Configuration
var limit = 50;

module.exports = function(app) {

	// Install bodyParser to extract params from post request
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	// Initialize router from loopback (express)
	var router = app.loopback.Router();

	// API for getting basic user information
	router.post('/users', function(req, res) {
		var token = req.body.token;
		Promise.join(
			user.projectsGroup(token),
			user.usersGroup(token), 
			function (projectsData, usersData) {
				console.log(projectsData);
				console.log(usersData);
				console.log('Info\tSending users info to front end ...');
				return res.json({ 
					status: 0, 
					res: {projectsData: projectsData.results, usersData: usersData.results} 
				});
		}).catch(
			function (err) {
				console.log(err);
		});
	});

	// TODO: It's been duplicated since API projectProfile contained  this part of data
	// API for getting basic device information, including sensors list of a device
	router.post('/deviceProfile', function (req, res) {
		var deviceId = req.body.deviceId,
			token    = req.body.token;

		device.deviceView(token, deviceId).then(
			function (data) {
				console.log(data);
				console.log('Info\tSending project profile to front end ...');
				return res.json({ status: 0, res: data });
			},
			function (err) {
				console.log(err);
			}
		);
	});

	// API for getting basic project information
	router.post('/projectProfile', function (req, res) {
		var projectId = req.body.projectId,
			token     = req.body.token;

		project.profileView(token, projectId).then(
			function (data) {
				console.log(data);
				console.log('Info\tSending project profile to front end ...');
				return res.json({ status: 0, res: data });
			},
			function (err) {
				console.log(err);
			}
		);
	});

	// API for getting temporal data in the latest time window and value window
	router.post('/sensorLatestTemporalView', function (req, res) {
		var sensorId = req.body.sensorId,
			token    = req.body.token;

		sensor.latestTemporalView(token, sensorId, limit).then(
			function (data) {
				// console.log(data);
				return res.json({ status: 0, res: data });
			},
			function (err) {
				console.log(err);
			}
		);
	});

	// API for getting geo location data in the latest time window and value window
	router.post('/geoSensorLatestMapView', function (req, res) {
		var deviceId  = req.body.deviceId,
			token     = req.body.token,
			limit     = req.body.limit;

			device.mapView(token, deviceId, limit).then(
				function (data) {
					// console.log(data);
					return res.json({ status: 0, res: data });
				},
				function (err) {
					console.log(err);
					return res.json({ status: 1, msg: err.msg });
				}
			)
	});

	// Render Dashboard Index Template
	router.get('/dashboard', function (req, res) {
    	return res.render(path.join(app.get('template') + '/index.html'));
  	});

  	// Render User Viewer Template
	router.get('/dashboard/user', function (req, res) {
    	return res.render(path.join(app.get('template') + '/user-viewer.html'));
  	});

	// Render Project Viewer Template
	router.get('/dashboard/project/:projectId', function (req, res) {
  		var projectId = req.params['projectId'];
    	return res.render(path.join(app.get('template') + '/project-viewer.html'), {projectId: projectId});
  	});

  	// Render Project Viewer Template
	router.get('/dashboard/device/:deviceId', function (req, res) {
  		var deviceId = req.params['deviceId'];
    	return res.render(path.join(app.get('template') + '/device-viewer.html'), {deviceId: deviceId});
  	});


  	// Render Sensor Viewer Template
	router.get('/dashboard/sensor/:sensorId', function (req, res) {
  		var sensorId = req.params['sensorId'];
    	return res.render(path.join(app.get('template') + '/sensor-viewer.html'), {sensorId: sensorId});
  	});

	// Start router
  	app.use(router);
};

//http://localhost:3000/dashboard/sensor/9Y6Qa4KU9GVmRKpAU5hBdm
//http://localhost:3000/dashboard/project/ycstS6W8qGAwad6KcwLGvh