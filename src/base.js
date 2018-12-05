import _debug from 'debug';
const debug = _debug('app:wechat:base');
import _ from 'lodash';
// import createBackend from './backend';
import DefaultAccessToken from './_access_token';
import { requestOrigin } from './_request';

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
   * 或:
   * opts = {
   *  getAccessToken // 函数,参数为force,是否强制更新access_token,默认为false不强制.返回token.
   * }
   * @param {object} opts
   */
  constructor(opts = {}) {
    if (!opts) {
      debug('error! no opts!');
      return;
    }
    if (opts.getAccessToken) {
      this.getAccessToken = opts.getAccessToken;
    } else {
      let accessToken = new DefaultAccessToken(opts);
      // this.appId = opts.appId;
      // this.appSecret = opts.appSecret;
      // this.backend = createBackend(opts.backend);
      this.getAccessToken = accessToken.getAccessToken;
    }
  }

  _request(url, opts = {}) {
    return requestOrigin(url, opts);
  }

  async request(url, opts) {
    var accessToken = await this.getAccessToken();
    if (!accessToken) {
      debug('warning! request -> getAccessToken fail! retry one more time!');
      accessToken = await this.getAccessToken();
    }
    if (!accessToken) {
      debug('error! request -> getAccessToken fail again! return null!');
      return null;
    }

    var url2 = url.replace(/ACCESS_TOKEN/g, accessToken.access_token);
    var retobj = await this._request(url2, opts);
    if (retobj) {
      if (retobj.errcode === 40001) {
        debug('error! access token error! fetch new access token!', retobj);
        accessToken = await this.getAccessToken(true);
        if (!accessToken) {
          debug('error! request -> getAccessToken error!');
          return null;
        }
        var url3 = url.replace(/ACCESS_TOKEN/g, accessToken.access_token);
        return this._request(url3, opts).then(retobj3 => {
          debug('after retry request', retobj3);
          return retobj3;
        });
      } else if (retobj.errcode) {
        debug('error! request -> _request, other error!', retobj);
        return retobj;
      } else {
        return retobj;
      }
    } else {
      debug('error! should not reach here! get null?');
      return retobj;
    }
  }

  get(url) {
    return this.request(url);
  }

  post(url, data) {
    var opts = {
      //dataType: 'json',
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    return this.request(url, opts);
  }
}
