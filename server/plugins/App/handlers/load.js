module.exports = (bigcommerce) => {
    return (request, reply) => {
        const account = bigcommerce.decode(request.query);

        if (!account) {
            return reply('Account not found').code(400);
        }

        getUserToken(account.user.id, (err, token) => {
            const client = bigcommerce.client(account, token);
            request.yar.set('token', token);

            // client.getOrders((err, data) => console.log(err, data));

            return reply.view('app', { user: account.user, token });
        });
    };
};

function getUserToken(userId, callback) {
    // TODO: Load access_token from database
    callback(null, '2ogcfh05ht6euruauheufh3wgih24jt');
}
