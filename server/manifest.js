var Confidence = require('confidence'),
    config = require('../config.json'),
    criteria = {
        env: process.env.NODE_ENV
    },
    store,
    manifest;

manifest = {
    server: {
        load: {
            sampleInterval: 5000
        }
    },
    connections: [{
        host: config.server.host,
        port: config.server.port,
        options: config.server.options
    }],
    plugins: {
        // Local Plugins
        './plugins/App': config.bigcommerce
    }
};

store = new Confidence.Store(manifest);

exports.get = function(key) {

    return store.get(key, criteria);
};

exports.meta = function(key) {

    return store.meta(key, criteria);
};
