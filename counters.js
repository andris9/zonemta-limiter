'use strict';

const fs = require('fs');
const ttlCounterScript = fs.readFileSync(__dirname + '/lua/ttlcounter.lua', 'utf-8');

module.exports = redis => {
    redis.defineCommand('ttlcounter', {
        numberOfKeys: 1,
        lua: ttlCounterScript
    });

    return {
        ttlcounter(key, count, max, windowSize, callback) {
            if (!max || isNaN(max)) {
                return callback(null, {
                    success: true,
                    value: 0,
                    ttl: 0
                });
            }
            redis.ttlcounter(key, count, max, windowSize || 86400, (err, res) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, {
                    success: !!((res && res[0]) || 0),
                    value: (res && res[1]) || 0,
                    ttl: (res && res[2]) || 0
                });
            });
        }
    };
};
