module.exports = (app) => {
    return (request, reply) => {
        const account = app.api.decode(request.query);

        if (!account) {
            return reply('Account not found').code(400);
        }

        app.getUserClient(account.user.id, (err, client) => {
            request.yar.set('token', client.token);

            // client.getOrders((err, data) => console.log(err, data));

            return reply.view('app', { user: account.user });
        });
    };
};
