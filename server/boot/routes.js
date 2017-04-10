var path       = require('path'),
	bodyParser = require('body-parser');

var sensor  = require('../dao/sensor.js'),
	project = require('../dao/project.js');

// Configuration
var limit = 50;

module.exports = function(app) {

	// Install bodyParser to extract params from post request
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	// Initialize router from loopback (express)
	var router = app.loopback.Router();

	// API for getting basic project information
	router.post('/projectProfile', function(req, res) {
		var projectId = req.body.projectId;
		project.profileView(projectId).then(
			function (data) {
				return res.json({ status: 0, res: data });
			},
			function (err) {
				console.log(err);
			}
		);
		
	});

	// API for getting temporal data in a specific time window and value window
	router.post('/sensorLatestTemporalView', function(req, res) {
		var sensorId  = req.body.sensorId,
			startTime = 0, //req.body.startTime,
			endTime   = 1590605000000, //req.body.endTime,
			minValue  = 0, //req.body.minValue,
			maxValue  = 19000000; //req.body.maxValue;

		sensor.latestTemporalView(sensorId, limit).then(
			function (data) {
				// console.log(data);
				return res.json({ status: 0, res: data });
			},
			function (err) {
				console.log(err);
			}
		);
	});

	// Render Project Viewer Template
	router.get('/monitor/project/:projectId', function(req, res) {
  		var projectId = req.params['projectId'];
    	return res.render(path.join(app.get('template') + '/project-viewer.html'), {projectId: projectId});
  	});

  	// Render Sensor Viewer Template
	router.get('/monitor/sensor/:sensorId', function(req, res) {
  		var sensorId = req.params['sensorId'];
    	return res.render(path.join(app.get('template') + '/sensor-viewer.html'), {sensorId: sensorId});
  	});

	// Start router
  	app.use(router);
}

//http://localhost:3000/monitor/sensor/9Y6Qa4KU9GVmRKpAU5hBdm
//http://localhost:3000/monitor/project/ycstS6W8qGAwad6KcwLGvh