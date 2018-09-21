import _debug from 'debug'
const debug = _debug('app:wechat:backend')
import _ from 'lodash';

import redis from 'redis';

export class BackendMemory {
    constructor (opts = {}) {
    }
    static data = {};

    mset = (main, sub, value) => {
        return new Promise ((resolve, reject) => {
            if (!this.data[main]) this.data[main] = {};
            this.data[main][sub] = value;
            resolve(value);
        })
    }
    mget = (main, sub) => {
        return new Promise ((resolve, reject) => {
            if (!this.data[main]) this.data[main] = {};
            let value = this.data[main][sub];
            resolve(value);
        });
    }
}

export class BackendRedis extends BackendMemory {
    constructor (opts = {}) {
        super (opts);
        if (opts.url) this.redisClient = redis.createClient(opts.url);
        else this.redisClient = redis.createClient();
        this.redisClient.on("error", error => {
            debug("Error", error);
        });
    }

    mset = (main, sub, value) => {
        return new Promise ((resolve, reject) => {
            this.redisClient.hmset(main, sub, JSON.stringify(value), (error, res) => {
                if (error) {
                    debug ("warning! save to redis fail, but we return ok, because we store it in class cache [accessTokenBase]!", err, res);
                    reject(error);
                } else resolve (value);
            });
        }).catch (error => {
            reject(error);
        })
    }
    mget = (main, sub) => {
        return new Promise ((resolve, reject) => {
            this.redisClient.hmget(main, sub, (error, reply) => {
                if (error) {
                    reject(error);
                } else {
                    if (reply.length > 0) {
                        let value = JSON.parse(reply[0]);
                        resolve (value);
                    } else {
                        resolve (null);
                    }
                }
            });
        }).catch (error => {
            reject(error);
        });
    }
}

export default (opts) => {
    if (opts && (opts.type === 'redis')) return new BackendRedis({url: opts.url});
    return new BackendMemory();
};
