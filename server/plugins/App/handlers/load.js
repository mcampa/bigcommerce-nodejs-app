module.exports = (app) => {
    return (request, reply) => {
        const account = app.api.decode(request.query);

        if (!account) {
            return reply('Account not found').code(400);
        }

        app.getUserClient(account.user.id, (err, client) => {
            request.yar.set('userId', account.user.id);
            return reply.view('app', { user: account.user });
        });
    };
};
