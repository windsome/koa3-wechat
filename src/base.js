import _debug from 'debug'
const debug = _debug('app:wechat:base')
import _ from 'lodash';
import createBackend from './backend';

export default class Base {
    /**
     * opts = {
     *  appId,
     *  appSecret,
     *  backend: {
     *    type: memory/redis,
     *    url
     *   }
     * }
     * @param {object} opts 
     */
    constructor (opts = {}) {
        this.appId = opts.appId;
        this.appSecret = opts.appSecret;
        this.backend = createBackend(opts.backend);
    }

    _saveAccessToken (appId, accessToken) {
        return this.backend.mset('accessToken', appId, accessToken).catch(error => accessToken);
    }
    _readAccessToken (appId) {
        return this.backend.mget('accessToken', appId);
    }

    getAccessToken () {
        return this._readAccessToken(this.appId).then (accessToken => {
            if (!accessToken) {
                debug ('no accessToken.'+this.appId+', need get a new one.');
                return this._fetchAccessToken ();
            }
            var currentTimestamp = parseInt(new Date().getTime() / 1000);
            var expireTime = accessToken.expire_time || 0;
            if (expireTime < currentTimestamp) {
                debug ('accessToken has expire, need to request a new one!', accessToken, currentTimestamp);
                return this._fetchAccessToken ();
            }
            return accessToken;
        });
    }

    _fetchAccessToken () {
        // ticket has expire, need to request new access token.
        var currentTimestamp = parseInt(new Date().getTime() / 1000);
        var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+this.appId+"&secret="+this.appSecret;
        return this._request(url)
            .then (retobj => {
                if (retobj && retobj.access_token) {
                    debug ("receive new access_token! cache it!", retobj);
                    var newToken = {};
                    newToken.expire_time = currentTimestamp + 7200;
                    newToken.access_token = retobj.access_token;
                    return this._saveAccessToken (this.appId, newToken).then(accessToken => {
                        if (!accessToken) {
                            debug ("warning! _fetchAccessToken -> _saveAccessToken fail! but we still return the token got!");
                        }
                        return newToken;
                    }).catch (error => {
                        debug ("error! _fetchAccessToken -> _saveAccessToken exception! but we still return the token got!", error);
                        return newToken;
                    });
                } else {
                    debug ("error! _fetchAccessToken fail!", retobj);
                    return null;
                }
            });
    }

    _request (url, opts = {}) {
        debug ("_request", url, opts);
        return fetch(url, opts)
            .then (data => {
                var contentType = data.headers.get('content-type');
                debug ("parse response, contentType="+contentType);
                if (_.startsWith(contentType, 'image/')) {
                    return { errcode: 1, xContentType: contentType, xOrigData: data }
                } else {
                    return data.json()
                        .catch (error => {
                            debug ("error! data.json() fail!", error);
                            return { errcode: 2, xOrigData: data }
                        });
                }
            })
            .then (retobj => {
                if (retobj){
                    debug ("_request fetch return:", retobj);
                    if (retobj.errcode) {
                        // debug ("get error!");
                        throw retobj;
                    }
                    return retobj;
                } else {
                    //debug ("should not reach here! fetch none!");
                    throw new Error ("response nothing! should not happen!");
                }
            })
            .catch (error => {
                debug ("error!", error);
                return { errcode:error.errcode||-2, message: error.errmsg||error.message };
            })
    }
    
    async request (url, opts) {
        var accessToken = await this.getAccessToken();
        if (!accessToken) {
            debug ("warning! request -> getAccessToken fail! retry one more time!");
            accessToken = await this.getAccessToken();
        }
        if (!accessToken) {
            debug ("error! request -> getAccessToken fail again! return null!");
            return null;
        }

        var url2 = url.replace(/ACCESS_TOKEN/g, accessToken.access_token);
        var retobj = await this._request(url2, opts)
        if (retobj) {
            if (retobj.errcode === 40001) {
                debug ("error! access token error! fetch new access token!", retobj)
                accessToken = await this._fetchAccessToken();
                if (!accessToken) {
                    debug ("error! request -> getAccessToken error!")
                    return null;
                }
                var url3 = url.replace(/ACCESS_TOKEN/g, accessToken.access_token);
                return this._request(url3, opts)
                    .then ((retobj3) => {
                        debug ("after retry request", retobj3);
                        return retobj3;
                    });
            } else if (retobj.errcode && retobj.errcode !== 0) {
                debug ("error! request -> _request, other error!", retobj);
                return retobj;
            } else {
                //debug ("_request ok!");
                return retobj;
            }
        } else {
            debug ("error! should not reach here! get null?");
            return retobj;
        }
    }

    get (url) {
        return this.request(url);
    }
    
    post (url, data) {
        var opts = {
            //dataType: 'json',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        return this.request(url, opts);
    }

}
