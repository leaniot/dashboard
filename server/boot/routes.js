var path       = require('path'),
	bodyParser = require('body-parser'),
	Promise    = require('bluebird');

var sensor  = require('../dao/sensor.js'),
	device  = require('../dao/device.js'),
	project = require('../dao/project.js'),
	user    = require('../dao/user.js');

var conn    = require('../dao/connection.js');
var dbConn = require('../dao/db_conn');

// Configuration
var limit = 50;

module.exports = function(app) {

	// Install bodyParser to extract params from post request
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	// Initialize router from loopback (express)
	var router = app.loopback.Router();

	router.post('/login', function(req, res) {
    conn.requestAccessToken(req.body.email, req.body.password).then(function(data) {
      res.send(data);
    });
  });

  router.post('/projects', function(req, res) {
    conn.getAllProjects(req.body.token).then(function(data) {
      res.send(data);
    });
  });

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
	// API for getting basic sensor information
	router.post('/sensorProfile', function (req, res) {
		var sensorId = req.body.sensorId,
			token    = req.body.token;

		sensor.sensorView(token, sensorId).then(
			function (data) {
				console.log(data);
				console.log('Info\tSending sensor profile to front end ...');
				return res.json({ status: 0, res: data });
			},
			function (err) {
				console.log(err);
			}
		);
	});

	// TODO: It's been duplicated since API projectProfile contained  this part of data
	// API for getting basic device information, including sensors list of a device
	router.post('/deviceProfile', function (req, res) {
		var deviceId = req.body.deviceId,
			token    = req.body.token;

		device.deviceView(token, deviceId).then(
			function (data) {
				console.log(data);
				console.log('Info\tSending device profile to front end ...');
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

	router.post('/data/:sensor_id/latest', function (req, res) {
    const sensor_id = req.params.sensor_id;

    dbConn.latest('First', sensor_id).then(function (data) {
      res.send(data);
    }).catch(function (err) {
      res.send({err: err.message});
    });
  })

  router.post('/data/:sensor_id/history', function (req, res) {
    const sensor_id = req.params.sensor_id;

    var since_ts   = +req.query.since;      // required
    var until_ts   = +req.query.until;      // optional
    var downsample = +req.query.downsample; // optional

    if (!since_ts) {
      throw 'Missing or invalid query: "since"';
    }

    if (!until_ts) {
      // until now by default
      until_ts = new Date().getTime();
    }

    var promise;
    if (downsample) {
      promise = dbConn.downsample('First', sensor_id, since_ts, until_ts, downsample);
    } else {
      promise = dbConn.history('First', sensor_id, since_ts, until_ts);
    }

    promise.then(function (arr) {
      res.send(arr);
    }).catch(function (err) {
        res.send({err: err.message});
    });
  })

	// Render Dashboard Index Template
	router.get('/dashboard', function (req, res) {
    	return res.render(path.join(app.get('template') + '/index.html'));
  	});

  	// Render User Viewer Template
	router.get('/dashboard/main', function (req, res) {
    	return res.render(path.join(app.get('template') + '/main-viewer.html'));
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

	// API Testbed
  router.get('/testbed', function(req, res) {
    return res.render(path.join(app.get('root'), 'testbed.html'));
  });

	// Start router
  	app.use(router);
};

//http://localhost:3000/dashboard/sensor/9Y6Qa4KU9GVmRKpAU5hBdm
//http://localhost:3000/dashboard/project/ycstS6W8qGAwad6KcwLGvh
