module.exports = (app) => {
    return (request, reply) => {
        const account = app.api.decode(request.query);

        if (!account) {
            return reply({ status: 'Account not found' }).code(400);
        }

        app.deleteUser(account.user.id, () => {
            request.yar.reset();

            return reply({ status: 'OK' });
        });
    };
}
