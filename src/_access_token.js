import _debug from 'debug';
const debug = _debug('app:wechat:accesstoken');
import _ from 'lodash';
import createBackend from './backend';
import { requestGet } from './_request';

export default class AccessToken {
  /**
   * opts = {
   *  appId,
   *  appSecret,
   *  backend: {
   *    type: memory/redis,
   *    url
   *  }
   * }
   * @param {object} opts
   */
  constructor(opts = {}) {
    this.appId = opts.appId;
    this.appSecret = opts.appSecret;
    this.backend = createBackend(opts.backend);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getAppId = this.getAppId.bind(this);
    this.getAppSecret = this.getAppSecret.bind(this);
    this.readApiTicket = this.readApiTicket.bind(this);
    this.saveApiTicket = this.saveApiTicket.bind(this);
}

  getAccessToken(force = false) {
    if (force) return this._fetchAccessToken();
    else
      return this._readAccessToken(this.appId).then(accessToken => {
        if (!accessToken) {
          debug('no accessToken.' + this.appId + ', need get a new one.');
          return this._fetchAccessToken();
        }
        var currentTimestamp = parseInt(new Date().getTime() / 1000);
        var expireTime = accessToken.expire_time || 0;
        if (expireTime < currentTimestamp) {
          debug(
            'accessToken has expire, need to request a new one!',
            accessToken,
            currentTimestamp
          );
          return this._fetchAccessToken();
        }
        return accessToken;
      });
  }

  _saveAccessToken(appId, accessToken) {
    return this.backend
      .mset('accessToken', appId, accessToken)
      .catch(error => accessToken);
  }
  _readAccessToken(appId) {
    return this.backend.mget('accessToken', appId);
  }
  _fetchAccessToken() {
    var currentTimestamp = parseInt(new Date().getTime() / 1000);
    var url =
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
      this.appId +
      '&secret=' +
      this.appSecret;
    return requestGet(url).then(retobj => {
      if (retobj && retobj.access_token) {
        debug('receive new access_token! cache it!', retobj);
        var newToken = {};
        newToken.expire_time = currentTimestamp + 7200;
        newToken.access_token = retobj.access_token;
        return this._saveAccessToken(this.appId, newToken)
          .then(accessToken => {
            if (!accessToken) {
              debug(
                'warning! _fetchAccessToken -> _saveAccessToken fail! but we still return the token got!'
              );
            }
            return newToken;
          })
          .catch(error => {
            debug(
              'error! _fetchAccessToken -> _saveAccessToken exception! but we still return the token got!',
              error
            );
            return newToken;
          });
      } else {
        debug('error! _fetchAccessToken fail!', retobj);
        return null;
      }
    });
  }

  getAppId() {
    return this.appId;
  }
  getAppSecret () {
    return this.appSecret;
  }
  saveApiTicket(ticket) {
    return this.backend
      .mset('apiTickets', this.appId, ticket)
      .catch(error => ticket);
  }
  readApiTicket() {
    return this.backend.mget('apiTickets', this.appId);
  }

}
