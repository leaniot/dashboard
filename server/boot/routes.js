var path       = require('path');
var bodyParser = require('body-parser');

module.exports = function(app) {

	// Install bodyParser to extract params from post request
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	// Initialize router from loopback (express)
	var router = app.loopback.Router();

	// API for getting basic project information
	router.post('/projectBasicInfo', function(req, res) {
		var projectId = req.body.projectId;
		return res.json({ status: 0, res: 'haha' });
	});

	// API for getting temporal data in a specific time window and value window
	router.post('/sensorTemporalData', function(req, res) {
		var projectId = req.body.projectId,
			deviceId  = req.body.deviceId,
			sensorId  = req.body.sensorId,
			startTime = req.body.startTime,
			endTime   = req.body.endTime,
			minValue  = req.body.minValue,
			maxValue  = req.body.maxValue;
		return res.json({ status: 0, res: 'haha' });
	});

	// Render Project Viewer Template
	router.get('/monitor/:projectId', function(req, res) {
  		var projectId = req.params['projectId'];
    	return res.render(path.join(app.get('template') + '/project-viewer.html'), {projectId: projectId});
  	});

	// Start router
  	app.use(router);
}