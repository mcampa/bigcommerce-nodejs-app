const path = require('path');
const apiClient = require('./lib/api-client');
const handleAuth = require('./handlers/auth');
const handleLoad = require('./handlers/load');
const handleUninstall = require('./handlers/uninstall');

exports.register = (server, options, next) => {
    const bigcommerce = apiClient(options);

    // Register the templates
    server.views({
        engines: {
            html: require('handlebars'),
        },
        path: path.join(__dirname, 'views'),
    });

    server.route({
        method: 'GET',
        path: '/app/auth',
        handler: handleAuth(bigcommerce),
    });

    server.route({
        method: 'GET',
        path: '/app/load',
        handler: handleLoad(bigcommerce),
    });

    server.route({
        method: 'GET',
        path: '/app/uninstall',
        handler: handleUninstall(bigcommerce),
    });

    next();
};

exports.register.attributes = {
    name: 'App',
    version: '1.0.0',
};
