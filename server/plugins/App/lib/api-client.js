const needle = require('needle');
const path = require('path');
const crypto = require('crypto');

function authorize(data, callback) {
    const payload = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.config.callbackUrl,
        code: data.code,
        scope: data.scope,
        context: data.context,
    };

    needle.post(this.config.authUrl, payload, (err, response) => {
        if (err) {
            return callback(err);
        }

        const res = response.body;

        if (res.error) {
            return callback(new Error(res.error_description || res.error));
        }

        return callback(null, res);
    });
}

function client(userId, context, token) {
    const client = { userId, token };
    const getUrl = (uri) => this.config.apiUrl + path.join(context, 'v2', uri);
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Auth-Client': this.config.clientId,
        'X-Auth-Token': token,
    };

    client.get = (uri, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }

        const url = getUrl(uri);

        params.headers = headers;

        needle.get(url, params, (err, response) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, response.body);
            }
        });
    };

    client.post = (uri, data, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }

        const url = getUrl(uri);

        params.headers = headers;

        needle.post(url, JSON.stringify(data), params, (err, response) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, response.body);
            }
        });
    };

    client.setHook = (scope, callback) => {
        const hook = {
            "scope": scope,
            "destination": `${this.config.webhookUrl}/${client.userId}`
        };

        console.log(`hooking to ${hook.destination}`);

        client.post('hooks', hook, callback);
    };

    client.getOrders = (callback) => {
        client.get('orders', callback);
    };

    return client;
}


function decode(query) {
    const signedPayload = query.signed_payload;

    if (!signedPayload) {
        throw new Error('The signature is invalid');
    }

    const data = signedPayload.split('.');

    if (data.length !== 2) {
        throw new Error('The signature is invalid');
    }

    const signature = new Buffer(data[1], 'base64').toString('utf8');
    const json = new Buffer(data[0], 'base64').toString('utf8');
    const payload = JSON.parse(json);
    const expected = crypto.createHmac('sha256', this.config.clientSecret).update(json).digest('hex');

    if (expected !== signature) {
        throw new Error('The signature is invalid');
    }

    return payload;
}

module.exports = (config) => {
    return {
        authorize: authorize.bind({ config }),
        client: client.bind({ config }),
        decode: decode.bind({ config }),
    };
};
