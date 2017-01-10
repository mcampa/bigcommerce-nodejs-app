'use strict';

const glue = require('glue');
const config = require('../config');

const manifest = {
    server: {
        load: {
            sampleInterval: 5000,
        }
    },
    connections: [
        {
            address: config.server.host,
            port: config.server.port,
        }
    ],
    registrations: [
        {
            plugin: { register: 'vision' }
        },
        {
            plugin: {
                register: './plugins/App',
                options: config.bigcommerce,
            }
        },
    ]
};

glue.compose(manifest, {relativeTo: __dirname}, (err, server) => {
    server.start(() => {
        console.log('Server running at: ' + server.connections[0].info.uri);
    });
});
