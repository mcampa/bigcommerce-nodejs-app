module.exports = (bigcommerce) => {
    return (request, reply) => {
        const account = bigcommerce.decode(request.query);

        if (!account) {
            return reply({ status: 'Account not found' }).code(400);
        }

        // TODO: remove user from database
        // deleteUserData(account.user.id)

        return reply({ status: 'OK' });
    };
}
