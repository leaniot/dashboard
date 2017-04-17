'use strict';

var loopback = require('loopback'),
    boot     = require('loopback-boot'),
    app      = module.exports = loopback(),
    path     = require('path');

var exec   = require('exec'),
    conn   = require('./dao/connection.js');
    // series = require('./dao/temporal-data.js');

// Set static files paths
app.set('template', path.join(__dirname, '../client/material/template'));
app.set('js', path.join(__dirname, '../client/js'));
app.set('css', path.join(__dirname, '../client/css'));
app.set('img', path.join(__dirname, '../client/img'));

// Set view engine
var engines = require('consolidate');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.start = function() {
// start the web server
    return app.listen(function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
        
        /*
         * For testing Rest Connector and Data Model
         */

        // app.models.sensorData.Test(2).then(
        //     function (res) {
        //         console.log(res);
        //     }, 
        //     function(error) {
        //         console.error('uh oh: ', error);
        //     }
        // );

        /*
         * For debugging and showing data in a easy way,
         * it invokes a shell to start visdom
         */

        // exec('echo test!', // + req.params.movie,
        //     function (error, stdout, stderr) {
        //         console.log('stdout: ' + stdout);
        //         console.log('stderr: ' + stderr);
        //         if (error != null) {
        //             console.log('exec error: ' + error);
        //         }
        // });

    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});


