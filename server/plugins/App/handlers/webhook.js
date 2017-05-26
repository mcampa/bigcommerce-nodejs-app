module.exports = (app) => {
    return (request, reply) => {
        const userId = request.params.userId;

        if (!userId) {
            return reply({ status: 'no user id' }).code(400);
        }

        console.log('Webhook Received', userId, request.payload);
        app.getUserClient(userId, (err, client) => {
            reply({ status: 'OK' });
        });
    };
};
