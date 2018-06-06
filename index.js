'use strict';

const counters = require('./counters');

module.exports.title = 'Limiter';
module.exports.init = function(app, done) {
    const ttlcounter = counters(app.redis).ttlcounter;

    app.addHook('sender:fetch', (delivery, next) => {
        if (!delivery.envelope.from || !delivery.envelope.to) {
            // having a lot of bounces (empty from) is OK
            return next();
        }

        let key = app.config.prefix + [delivery.envelope.from || '', delivery.envelope.to || ''].join(':');

        ttlcounter(key, 1, app.config.limit, app.config.windowSize, (err, limRes) => {
            if (err) {
                app.logger.error('Ratelimit', 'RLERR from=%s to=%s error=%s', delivery.envelope.from, delivery.envelope.to, err.message);
                // passthrough just in case
                return next();
            }

            if (!limRes.success) {
                let err = new Error(
                    'EXCESSERR from=' + delivery.envelope.from + ' to=' + delivery.envelope.to + ' count=' + limRes.value + ' ttl=' + limRes.ttl
                );
                err.responseCode = 582; // made up error code to ensure message rejection
                err.category = 'limiter';
                delivery.skipBounce = err.message;

                if (!app.config.debug) {
                    return next(err);
                } else {
                    app.logger.error('Ratelimit', err.message);
                }
            }

            next();
        });
    });

    done();
};
