module.exports = (bigcommerce) => {
    return (request, reply) => {
        // Webhook Received
        console.log(request.params, request.payload);

        reply({ status: 'OK' });
    };
};
