const async = require('async');

module.exports = (app) => {
    return (request, reply) => {
        const query = request.query || {};
        const payload = {
            code: query.code,
            scope: query.scope,
            context: query.context,
        };

        if (!query.code) {
            return reply('Invalid code').code(400);
        }

        app.api.authorize(payload, (err, account) => {
            if (err) {
                throw err;
            }

            app.saveUser(account.user.id, account.context, account.access_token, (err) => {
                if (err) {
                    throw err;
                }

                const client = app.api.client(account.user.id, account.context, account.access_token);

                subscribeWebHooks(client, (err) => {
                    if (err) {
                        throw err;
                    }

                    return reply.view('app', { user: account.user });
                });
            });

        });
    };

    function subscribeWebHooks(client, callback) {
        const scopes = [
            'store/order/*',
            'store/product/*',
            'store/customer/*',
        ];

        async.each(scopes, (scope, next) => {
            console.log(`hooking ${scope} to account ${client.userId}`);
            client.setHook(scope, next);
        }, callback);
    }
}
