var path = require('path');

module.exports = function(app) {
	var router = app.loopback.Router();

	// Install a "/ping" route that returns "pong"
	router.get('/test', function(req, res) {
		res.send('test!');
	});

	router.get('/monitor/:projectId', function(req, res) {
  		var projectId = req.params['projectId'];
  		console.log(projectId);
    	return res.render(path.join(app.get('template') + '/project-viewer.html'), {projectId: projectId});
  	});

  	app.use(router);
}