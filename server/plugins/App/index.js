const path = require('path');
const apiClient = require('./lib/api-client');
const handleAuth = require('./handlers/auth');
const handleLoad = require('./handlers/load');
const handleUninstall = require('./handlers/uninstall');
const handleWebhook = require('./handlers/webhook');


exports.register = (server, options, next) => {
    const app = {
        api: apiClient({
            clientId: options.bcClientId,
            clientSecret: options.bcClientSecret,
            authUrl: options.bcAuthUrl,
            apiUrl: options.bcApiUrl,
            callbackUrl: `${options.appUrl}${options.authUri}`,
            webhookUrl: `${options.appUrl}${options.webhookUri}`,
        }),

        getUserClient(userId, callback) {
            // TODO: Load access_token from database
            const token = 'xxx';
            const context = 'xxx';
            const client = this.api.client(userId, context, token);

            callback(null, client);
        },

        saveUser(userId, context, token, callback) {
            console.log(`Authorized user ${userId} ${context} token ${token}`);
            // TODO: Save access_token to database
            callback();
        },

        deleteUser(userId, callback) {
            console.log(`Deleting user ${userId}`);
            // TODO: Delete user from db
            callback();
        },

    };

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
        handler: handleAuth(app),
    });

    server.route({
        method: 'GET',
        path: options.loadUri,
        handler: handleLoad(app),
    });

    server.route({
        method: 'GET',
        path: options.uninstallUri,
        handler: handleUninstall(app),
    });

    server.route({
        method: 'POST',
        path: `${options.webhookUri}/{userId}`,
        handler: handleWebhook(app),
    });

    next();
};

exports.register.attributes = {
    name: 'App',
    version: '1.0.0',
};
