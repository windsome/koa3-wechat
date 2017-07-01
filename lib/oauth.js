'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('app:wechat:oauth');

var Oauth = function (_Base) {
    (0, _inherits3.default)(Oauth, _Base);

    function Oauth() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Oauth);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Oauth.__proto__ || (0, _getPrototypeOf2.default)(Oauth)).call(this, opts));

        _this.oauthAccessToken = {};
        _this.userInfo = {};
        return _this;
    }

    /**
     * 获取授权页面的URL地址
     * @param {String} redirect 授权后要跳转的地址
     * @param {String} state 开发者可提供的数据
     * @param {String} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
     */


    (0, _createClass3.default)(Oauth, [{
        key: 'getAuthorizeURL',
        value: function getAuthorizeURL(redirect, state, scope) {
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
            var info = {
                appid: this.appId,
                redirect_uri: redirect,
                response_type: 'code',
                scope: scope || 'snsapi_base',
                state: state || ''
            };

            return url + '?' + _querystring2.default.stringify(info) + '#wechat_redirect';
        }

        /**
         * 获取授权页面的URL地址
         * @param {String} redirect 授权后要跳转的地址
         * @param {String} state 开发者可提供的数据
         * @param {String} scope 作用范围，值为snsapi_login，前者用于弹出，后者用于跳转
         */

    }, {
        key: 'getAuthorizeURLForWebsite',
        value: function getAuthorizeURLForWebsite(redirect, state, scope) {
            var url = 'https://open.weixin.qq.com/connect/qrconnect';
            var info = {
                appid: this.appId,
                redirect_uri: redirect,
                response_type: 'code',
                scope: scope || 'snsapi_login',
                state: state || ''
            };

            return url + '?' + _querystring2.default.stringify(info) + '#wechat_redirect';
        }

        /**
         * 根据授权获取到的code，换取access token和openid
         * 获取openid之后，可以调用`wechat.API`来获取更多信息
         * Examples:
         * ```
         * api.getOauthAccessToken(code, callback);
         * ```
         * Callback:
         *
         * - `err`, 获取access token出现异常时的异常对象
         * - `result`, 成功时得到的响应结果
         *
         * Result:
         * ```
         * {
         *  data: {
         *    "access_token": "ACCESS_TOKEN",
         *    "expires_in": 7200,
         *    "refresh_token": "REFRESH_TOKEN",
         *    "openid": "OPENID",
         *    "scope": "SCOPE"
         *  }
         * }
         * ```
         * @param {String} code 授权获取到的code
         * @param {Function} callback 回调函数
         */

    }, {
        key: 'getOauthAccessToken',
        value: function getOauthAccessToken(code) {
            var _this2 = this;

            var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code".replace(/APPID/g, this.appId).replace(/SECRET/g, this.appSecret).replace(/CODE/g, code);
            return this.get(url).then(function (retobj) {
                if (retobj && retobj.openid) {
                    _this2.oauthAccessToken[retobj.openid] = retobj;
                } else {
                    debug("not get openid!", retobj);
                }
                return retobj;
            });
        }

        /**
         * 根据refresh token，刷新access token，调用getAccessToken后才有效
         * Examples:
         * ```
         * api.refreshAccessToken(refreshToken, callback);
         * ```
         * Callback:
         *
         * - `err`, 刷新access token出现异常时的异常对象
         * - `result`, 成功时得到的响应结果
         *
         * Result:
         * ```
         * {
         *  data: {
         *    "access_token": "ACCESS_TOKEN",
         *    "expires_in": 7200,
         *    "refresh_token": "REFRESH_TOKEN",
         *    "openid": "OPENID",
         *    "scope": "SCOPE"
         *  }
         * }
         * ```
         * @param {String} refreshToken refreshToken
         * @param {Function} callback 回调函数
         */

    }, {
        key: 'refreshOauthAccessToken',
        value: function refreshOauthAccessToken(refreshToken) {
            var _this3 = this;

            var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN".replace(/APPID/g, this.appId).replace(/REFRESH_TOKEN/g, refreshToken);
            return this.get(url).then(function (retobj) {
                if (retobj && retobj.openid) {
                    _this3.oauthAccessToken[retobj.openid] = retobj;
                } else {
                    debug("not get openid!", retobj);
                }
                return retobj;
            });
        }
    }, {
        key: '_getUser',
        value: function _getUser(openid, oauthAccessToken) {
            var _this4 = this;

            var url = "https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN".replace(/ACCESS_TOKEN/g, oauthAccessToken).replace(/OPENID/g, openid);
            return this.get(url).then(function (retobj) {
                if (retobj && retobj.openid) {
                    _this4.userInfo[retobj.openid] = retobj;
                } else {
                    debug("not get userinfo!", retobj);
                }
                return retobj;
            });
        }

        /**
         * 根据openid，获取用户信息。
         * 当access token无效时，自动通过refresh token获取新的access token。然后再获取用户信息
         * Examples:
         * ```
         * api.getUser(options, callback);
         * ```
         *
         * Options:
         * ```
         * openId
         * // 或
         * {
         *  "openid": "the open Id", // 必须
         *  "lang": "the lang code" // zh_CN 简体，zh_TW 繁体，en 英语
         * }
         * ```
         * Result:
         * ```
         * {
         *  "openid": "OPENID",
         *  "nickname": "NICKNAME",
         *  "sex": "1",
         *  "province": "PROVINCE"
         *  "city": "CITY",
         *  "country": "COUNTRY",
         *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
         *  "privilege": [
         *    "PRIVILEGE1"
         *    "PRIVILEGE2"
         *  ]
         * }
         * ```
         * @param {Object|String} options 传入openid或者参见Options
         * @param {Function} callback 回调函数
         */

    }, {
        key: 'getUser',
        value: function getUser(oauthAccessToken) {
            var _this5 = this;

            return this._getUser(oauthAccessToken.openid, oauthAccessToken.access_token).then(function (retobj) {
                if (retobj.openid) {
                    debug("get user info success!");
                    return retobj;
                } else {
                    debug("get user info fail! try refresh token", retobj);
                    return _this5.refreshOauthAccessToken(oauthAccessToken.refresh_token).then(function (retobj2) {
                        if (retobj2 && retobj2.openid) {
                            debug("refresh oauth token ok! try get user info again");
                            return _this5._getUser(retobj2.openid, retobj2.access_token);
                        } else {
                            // return old _getUser() error.
                            return retobj;
                        }
                    });
                }
            });
        }

        /**
         * 检验授权凭证（access_token）是否有效。
         * Examples:
         * ```
         * api.verifyToken(openid, accessToken, callback);
         * ```
         * @param {String} openid 传入openid
         * @param {String} accessToken 待校验的access token
         * @param {Function} callback 回调函数
         */

    }, {
        key: 'verifyOauthToken',
        value: function verifyOauthToken(openid, oauthAccessToken) {
            var url = "https://api.weixin.qq.com/sns/auth?access_token=ACCESS_TOKEN&openid=OPENID".replace(/ACCESS_TOKEN/g, oauthAccessToken).replace(/OPENID/g, openid);
            return this.get(url).then(function (retobj) {
                if (retobj && retobj.errcode === 0) {
                    //return true;
                } else {
                    debug("verify fail!", retobj);
                }
                return retobj;
            });
        }

        /**
         * 根据code，获取用户信息。
         * Examples:
         * ```
         * api.getUserByCode(code, callback);
         * ```
         * Callback:
         *
         * - `err`, 获取用户信息出现异常时的异常对象
         * - `result`, 成功时得到的响应结果
         *
         * Result:
         * ```
         * {
         *  "openid": "OPENID",
         *  "nickname": "NICKNAME",
         *  "sex": "1",
         *  "province": "PROVINCE"
         *  "city": "CITY",
         *  "country": "COUNTRY",
         *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
         *  "privilege": [
         *    "PRIVILEGE1"
         *    "PRIVILEGE2"
         *  ]
         * }
         * ```
         * @param {Object|String} options 授权获取到的code
         * @param {Function} callback 回调函数
         */

    }, {
        key: 'getUserByCode',
        value: function getUserByCode(code, scope) {
            var _this6 = this;

            return this.getOauthAccessToken(code).then(function (retobj) {
                if (retobj.openid) {
                    if (scope == 'snsapi_userinfo') {
                        var openid = result.data.openid;
                        return _this6.getUser(retobj);
                    } else {
                        return retobj;
                    }
                } else {
                    debug("error! not get openid!", retobj);
                    return retobj;
                }
            });
        }
    }]);
    return Oauth;
}(_base2.default);

exports.default = Oauth;