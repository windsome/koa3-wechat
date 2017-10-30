'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('app:server:wechat:base');

var redisClient = _redis2.default.createClient();
redisClient.on("error", function (err) {
    debug("Error", err);
});

var Base = function () {
    function Base() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Base);

        this.appId = opts.appId;
        this.appSecret = opts.appSecret;
        //this.accessToken = {};
    }

    (0, _createClass3.default)(Base, [{
        key: '_saveAccessToken',
        value: function _saveAccessToken(appId, accessToken) {
            Base.accessTokenBase[appId] = accessToken;
            return new _promise2.default(function (resolve, reject) {
                redisClient.hmset("accessToken", appId, (0, _stringify2.default)(accessToken), function (err, res) {
                    if (err) {
                        debug("warning! save to redis fail, but we return ok, because we store it in class cache [accessTokenBase]!", err, res);
                        //reject(err);
                        resolve(accessToken);
                    } else resolve(accessToken);
                });
            }).catch(function (error) {
                debug("error! save to redis fail, but we return ok, because we store it in class cache [accessTokenBase]!", error);
                return accessToken;
            });
        }
    }, {
        key: '_readAccessToken',
        value: function _readAccessToken(appId) {
            return new _promise2.default(function (resolve, reject) {
                redisClient.hmget("accessToken", appId, function (err, reply) {
                    if (err) {
                        reject(new Error("warning! read from redis fail" + err));
                        //reject(err);
                    } else {
                        if (reply.length > 0) {
                            var accessToken = JSON.parse(reply[0]);
                            Base.accessTokenBase[appId] = accessToken;
                            resolve(accessToken);
                        } else {
                            reject(new Error("warning! find none in redis!"));
                        }
                    }
                });
            }).catch(function (error) {
                debug("error! read from redis fail, but we return the one stored it in class cache [accessTokenBase]!", error);
                return Base.accessTokenBase[appId];
            });
        }
    }, {
        key: 'getAccessToken',
        value: function getAccessToken() {
            var _this = this;

            return this._readAccessToken(this.appId).then(function (accessToken) {
                var currentTimestamp = parseInt(new Date().getTime() / 1000);
                var expireTime = accessToken && accessToken.expire_time || 0;
                if (!accessToken || expireTime < currentTimestamp) {
                    debug("accessToken has expire, need to request a new one!", accessToken, currentTimestamp);
                    return _this._fetchAccessToken();
                }
                return accessToken;
            });
        }
    }, {
        key: '_fetchAccessToken',
        value: function _fetchAccessToken() {
            var _this2 = this;

            // ticket has expire, need to request new access token.
            var currentTimestamp = parseInt(new Date().getTime() / 1000);
            var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + this.appId + "&secret=" + this.appSecret;
            return this._request(url).then(function (retobj) {
                if (retobj && retobj.access_token) {
                    debug("receive new access_token! cache it!", retobj);
                    var newToken = {};
                    newToken.expire_time = currentTimestamp + 7200;
                    newToken.access_token = retobj.access_token;
                    return _this2._saveAccessToken(_this2.appId, newToken).then(function (accessToken) {
                        if (!accessToken) {
                            debug("warning! _fetchAccessToken -> _saveAccessToken fail! but we still return the token got!");
                        }
                        return newToken;
                    }).catch(function (error) {
                        debug("error! _fetchAccessToken -> _saveAccessToken exception! but we still return the token got!", error);
                        return newToken;
                    });
                } else {
                    debug("error! _fetchAccessToken fail!", retobj);
                    return null;
                }
            });
        }
    }, {
        key: '_request',
        value: function _request(url) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            debug("_request", url, opts);
            return fetch(url, opts).then(function (data) {
                var contentType = data.headers.get('content-type');
                debug("parse response, contentType=" + contentType);
                if (_lodash2.default.startsWith(contentType, 'image/')) {
                    return { errcode: 1, xContentType: contentType, xOrigData: data };
                } else {
                    return data.json().catch(function (error) {
                        debug("error! data.json() fail!", error);
                        return { errcode: 2, xOrigData: data };
                    });
                }
            }).then(function (retobj) {
                if (retobj) {
                    debug("_request fetch return:", retobj);
                    if (retobj.errcode && retobj.errcode === 0) {
                        debug("get error!");
                    }
                    return retobj;
                } else {
                    //debug ("should not reach here! fetch none!");
                    throw new Error("response nothing! should not happen!");
                }
            }).catch(function (error) {
                debug("error!", error);
                return { errcode: -2, message: error.message };
            });
        }
    }, {
        key: 'request',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, opts) {
                var accessToken, url2, retobj, url3;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getAccessToken();

                            case 2:
                                accessToken = _context.sent;

                                if (accessToken) {
                                    _context.next = 8;
                                    break;
                                }

                                debug("warning! request -> getAccessToken fail! retry one more time!");
                                _context.next = 7;
                                return this.getAccessToken();

                            case 7:
                                accessToken = _context.sent;

                            case 8:
                                if (accessToken) {
                                    _context.next = 11;
                                    break;
                                }

                                debug("error! request -> getAccessToken fail again! return null!");
                                return _context.abrupt('return', null);

                            case 11:
                                url2 = url.replace(/ACCESS_TOKEN/g, accessToken.access_token);
                                _context.next = 14;
                                return this._request(url2, opts);

                            case 14:
                                retobj = _context.sent;

                                if (!retobj) {
                                    _context.next = 36;
                                    break;
                                }

                                if (!(retobj.errcode === 40001)) {
                                    _context.next = 28;
                                    break;
                                }

                                debug("error! access token error! fetch new access token!", retobj);
                                _context.next = 20;
                                return this._fetchAccessToken();

                            case 20:
                                accessToken = _context.sent;

                                if (accessToken) {
                                    _context.next = 24;
                                    break;
                                }

                                debug("error! request -> getAccessToken error!");
                                return _context.abrupt('return', null);

                            case 24:
                                url3 = url.replace(/ACCESS_TOKEN/g, accessToken.access_token);
                                return _context.abrupt('return', this._request(url3, opts).then(function (retobj3) {
                                    debug("after retry request", retobj3);
                                    return retobj3;
                                }));

                            case 28:
                                if (!(retobj.errcode && retobj.errcode !== 0)) {
                                    _context.next = 33;
                                    break;
                                }

                                debug("error! request -> _request, other error!", retobj);
                                return _context.abrupt('return', retobj);

                            case 33:
                                return _context.abrupt('return', retobj);

                            case 34:
                                _context.next = 38;
                                break;

                            case 36:
                                debug("error! should not reach here! get null?");
                                return _context.abrupt('return', retobj);

                            case 38:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function request(_x3, _x4) {
                return _ref.apply(this, arguments);
            }

            return request;
        }()
    }, {
        key: 'get',
        value: function get(url) {
            return this.request(url);
        }
    }, {
        key: 'post',
        value: function post(url, data) {
            var opts = {
                //dataType: 'json',
                method: 'POST',
                body: (0, _stringify2.default)(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            return this.request(url, opts);
        }
    }]);
    return Base;
}();

Base.accessTokenBase = {};
exports.default = Base;