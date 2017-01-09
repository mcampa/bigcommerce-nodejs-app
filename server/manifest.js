const Confidence = require('confidence');
const config = require('../config.json');
const criteria = {
    env: process.env.NODE_ENV,
};

const manifest = {
    server: {
        load: {
            sampleInterval: 5000,
        },
    },
    connections: [{
        host: config.server.host,
        port: config.server.port,
        options: config.server.options,
    }],
    plugins: {
        './plugins/App': config.bigcommerce,
    },
};

const store = new Confidence.Store(manifest);

exports.get = (key) => store.get(key, criteria);
exports.meta = (key) => store.meta(key, criteria);
