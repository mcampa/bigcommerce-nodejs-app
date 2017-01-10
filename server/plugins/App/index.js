const path = require('path');
const apiClient = require('./lib/api-client');
const handleAuth = require('./handlers/auth');
const handleLoad = require('./handlers/load');
const handleUninstall = require('./handlers/uninstall');
const handleWebhook = require('./handlers/webhook');

exports.register = (server, options, next) => {
    const bigcommerce = apiClient({
        clientId: options.bcClientId,
        clientSecret: options.bcClientSecret,
        authUrl: options.bcAuthUrl,
        apiUrl: options.bcApiUrl,
        callbackUrl: `${options.appUrl}${options.authUri}`,
        webhookUrl: `${options.appUrl}${options.webhookUri}`,
    });

    // Register the templates
    server.views({
        engines: {
            html: require('handlebars'),
        },
        path: path.join(__dirname, 'views'),
    });

    server.ext('onPreHandler', (request, reply) => {
        console.log(request.method.toUpperCase(), request.path);
        reply.continue();
    });

    server.route({
        method: 'GET',
        path: options.authUri,
        handler: handleAuth(bigcommerce),
    });

    server.route({
        method: 'GET',
        path: options.loadUri,
        handler: handleLoad(bigcommerce),
    });

    server.route({
        method: 'GET',
        path: options.uninstallUri,
        handler: handleUninstall(bigcommerce),
    });

    server.route({
        method: 'POST',
        path: `${options.webhookUri}/{userId}`,
        handler: handleWebhook(bigcommerce),
    });

    next();
};

exports.register.attributes = {
    name: 'App',
    version: '1.0.0',
};
