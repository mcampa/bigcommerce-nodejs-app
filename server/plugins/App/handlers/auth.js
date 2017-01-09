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
            // saveUserData(account.user.id, account.access_token)
            // const client = bigcommerce.api(account, account.access_token)

            return reply.view('app', { user: account.user });
        });
    };
}
