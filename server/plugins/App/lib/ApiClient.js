var needle = require('needle'),
    path = require('path'),
    crypto = require('crypto'),
    _ = require('lodash'),
    internals = {
        config: {}
    };

module.exports = function(config) {
    internals.config = config;

    return {
        authorize: internals.authorize,
        api: internals.api,
        decode: internals.decode
    }
};

internals.authorize = function(data, callback) {
    var config = internals.config;

    var payload = {
        client_id     : config.clientId,
        client_secret : config.clientSecret,
        grant_type    : 'authorization_code',
        redirect_uri  : config.callbackUrl,
        code          : data.code,
        scope         : data.scope,
        context       : data.context,
    };
    
    console.log('Authorizing ' + data.context);

    needle.post(config.bcAuthUrl, payload, function(err, response) {

        if (err) {
            return callback(err);
        }

        var data = response.body;

        if (data.error) {
            return callback(new Error(data.error_description || data.error));
        }

        return callback(null, data);
    });
};

internals.api = function(account, accessToken) {
    var config = internals.config;

    var api = this;


    function getUrl(uri) {
        return config.bcApiUrl + path.join(account.context, 'v2', uri);
    }

    function getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Auth-Client': config.clientId,
            'X-Auth-Token': accessToken
        };
    }

    api.get = function(uri, params, callback) {

        if (typeof params === 'function') {
            callback = params;
            params = {};
        }

        var url = getUrl(uri);

        params.headers = getHeaders();


        console.log('get', url);

        needle.get(url, params, function(err, response) {

            if (err) {
                callback(err, null);
            } else {
                callback(null, response.body);
            }

        });
    }

    api.post = function(uri, data, params, callback) {

        if (typeof params === 'function') {
            callback = params;
            params = {};
        }

        var url = getUrl(uri);

        params.headers = getHeaders();

        console.log('post', url);

        needle.post(url, JSON.stringify(data), params, function(err, response) {

            if (err) {
                callback(err, null);
            } else {
                callback(null, response.body);
            }

        });
    }

    api.setHook = function(hook, callback) {

        api.post('hooks', hook, callback);
    }

    api.getOrders = function(callback) {
        api.get('orders', callback); 
    }
};


internals.decode = function(signedPayload) {
    var data = signedPayload.split('.'),
        signature = new Buffer(data[1], 'base64').toString('utf8'),
        json = new Buffer(data[0], 'base64').toString('utf8'),
        payload = JSON.parse(json),
        expected = crypto.createHmac('sha256', internals.config.clientSecret).update(json).digest('hex');

    if (expected !== signature) {
        throw new Error('Signature is invalid');
    }

    return payload;
};
