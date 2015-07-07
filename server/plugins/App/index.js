var ApiClient = require('./lib/ApiClient'),
    Path = require('path'),
    bigcommerce,
    internals = {};

exports.register = function(server, options, next) {
    bigcommerce = ApiClient(options);

    // Register the templates
    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'views')
    });

    server.ext('onRequest', function (request, reply) {
        console.log(request.path);
        reply.continue();
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function(req, reply) {return reply('Hello');}
    });

    server.route({
        method: 'GET',
        path: '/app/auth',
        handler: internals.handleInstall
    });

    server.route({
        method: 'GET',
        path: '/app/load',
        handler: internals.handleLoad
    });

    server.route({
        method: 'GET',
        path: '/app/uninstall',
        handler: internals.handleUninstall
    });

    next();
};

exports.register.attributes = {
    name: 'App',
    version: '1.0.0'
};

internals.handleInstall = function(request, reply) {
    var data = request.query || {},
        payload = {
            code: data.code,
            scope: data.scope,
            context: data.context
        };

    if (!data.code) {
        return reply.view('app.404');
    }

    bigcommerce.authorize(payload, function(err, account) {

        if (err) {
            console.log(err);
            return reply(err);
        }

        console.log(account.user);

        // TODO: Should save this to a database
        // saveUserData(account.user.id, account.access_token)
        // var client = bigcommerce.api(account, account.access_token)

        return reply.view('app', {user: account.user});
    });
};

internals.handleLoad = function(request, reply) {
    var account = bigcommerce.decode(request.query.signed_payload);

    if (!account) {
        return reply('Account not found');
    }

    console.log(account);

    // TODO: Load access_token from database
    // var token = getUserData(account.user.id)
    // var client = bigcommerce.api(account, token)

    return reply.view('app', {user: account.user});
};


internals.handleUninstall = function(request, reply) {
    var account = bigcommerce.decode(request.query.signed_payload);

    if (!account) {
        return reply('Account not found');
    }

    console.log('Uninstalling account ' + account.user.id);

    // TODO: remove user from database
    // deleteUserData(account.user.id)

    return reply('OK');
};
