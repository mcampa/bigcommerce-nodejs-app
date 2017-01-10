const async = require('async');

module.exports = (bigcommerce) => {
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

        bigcommerce.authorize(payload, (err, account) => {
            if (err) {
                throw err;
            }

            // TODO: Should save this to a database
            saveUserToken(account.user.id, account.access_token, (err) => {
                console.log(`Authorized user ${account.user.id} token ${account.access_token}`);
                if (err) {
                    throw err;
                }

                const client = bigcommerce.client(account, account.access_token);

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
            console.log(`hooking ${scope} to user ${client.account.user.id}`);
            client.setHook(scope, next);
        }, callback);
    }
}

function saveUserToken(userId, token, callback) {
    // TODO: Save access_token to database
    callback();
}
