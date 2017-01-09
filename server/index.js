'use strict';

const glue = require('glue');
const manifest = require('./manifest');

glue.compose(manifest.get('/'), {relativeTo: __dirname}, (err, server) => {
    server.start(() => {
        console.log('Server running at: ' + server.connections[0].info.uri);
    });
});
