module.exports = (app) => {
    return (request, reply) => {
        const userId = request.params.userId;
        // Webhook Received
        console.log(userId, request.payload);

        if (!userId) {
            return reply({ status: 'no user id' }).code(400);
        }

        app.getUserClient(userId, (err, client) => {
            reply({ status: 'OK' });
        });
    };
};
