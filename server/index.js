'use strict';

var cluster = require('cluster'),
    cCPUs = require('os').cpus().length,
    Glue = require('glue'),
    manifest = require('./manifest'),
    config = require('../config.json');

Glue.compose(manifest.get('/'), {relativeTo: __dirname}, function(err, server) {

    if (cluster.isMaster && config.server.cluster) {

        for(var i = 0; i < cCPUs; i++) {
            cluster.fork();
        }

        cluster.on('online', function(worker) {
            console.log('Worker ' + worker.process.pid + ' started.');
        });

        cluster.on('exit', function(worker, code, signal) {
            console.log('Worker ' + worker.process.pid + ' died.');
            cluster.fork();
        });

    } else {

        server.start(function() {
            console.log('Server running at: ' + server.connections[0].info.uri);
        });
    }
});
