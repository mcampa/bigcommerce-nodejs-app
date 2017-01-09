module.exports = (bigcommerce) => {
    return (request, reply) => {
        const account = bigcommerce.decode(request.query);

        if (!account) {
            return reply('Account not found').code(400);
        }

        // TODO: Load access_token from database
        // const token = getUserData(account.user.id)
        // const client = bigcommerce.api(account, token)

        return reply.view('app', { user: account.user });
    };
}
