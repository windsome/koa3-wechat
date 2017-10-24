'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _request2 = require('request');

var _request3 = _interopRequireDefault(_request2);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _md5sum = require('./_md5sum');

var _md5sum2 = _interopRequireDefault(_md5sum);

var _sha1sum = require('./_sha1sum');

var _sha1sum2 = _interopRequireDefault(_sha1sum);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('app:server:wepay');
debug.log = console.log.bind(console);

var signTypes = {
    MD5: _md5sum2.default,
    SHA1: _sha1sum2.default
};

var URLS_NORMAL = {
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    ORDER_QUERY: 'https://api.mch.weixin.qq.com/pay/orderquery',
    REFUND: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
    REFUND_QUERY: 'https://api.mch.weixin.qq.com/pay/refundquery',
    DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/pay/downloadbill',
    SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/pay/closeorder'
};

var URLS_SANDBOX = {
    GET_SIGN_KEY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey',
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
    ORDER_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
    REFUND: 'https://api.mch.weixin.qq.com/secapi/sandboxnew/pay/refund',
    REFUND_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
    DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadbill',
    SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder'
};

//var URLS = URLS_SANDBOX;
var URLS = URLS_NORMAL;

var Wepay = function () {
    function Wepay() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Wepay);

        this.appId = config.appId;
        this.subAppId = config.subAppId;
        this.partnerKey = config.partnerKey;
        this.orignPartnerKey = config.partnerKey;
        this.mchId = config.mchId;
        this.subMchId = config.subMchId;
        this.notifyUrl = config.notifyUrl;
        this.passphrase = config.passphrase || config.mchId;
        this.pfx = config.pfx;
    }

    (0, _createClass3.default)(Wepay, [{
        key: 'getBrandWCPayRequestParams',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(order) {
                var self, default_params, retobj, params;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;
                                default_params = {
                                    appId: this.appId,
                                    timeStamp: this._generateTimeStamp(),
                                    nonceStr: this._generateNonceStr(),
                                    signType: 'MD5'
                                };


                                order = (0, _extends3.default)({ notify_url: this.notifyUrl }, order);

                                _context.next = 5;
                                return this.unifiedOrder(order);

                            case 5:
                                retobj = _context.sent;
                                params = (0, _extends3.default)({}, default_params, { package: 'prepay_id=' + retobj.prepay_id });
                                //if (order.total_fee) params.total_fee = order.total_fee+"";

                                params.paySign = this._getSign(params);
                                if (order.trade_type == 'NATIVE') {
                                    params.code_url = retobj.code_url;
                                }
                                params.timestamp = params.timeStamp;
                                return _context.abrupt('return', params);

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getBrandWCPayRequestParams(_x2) {
                return _ref.apply(this, arguments);
            }

            return getBrandWCPayRequestParams;
        }()

        /**
         * Generate parameters for `WeixinJSBridge.invoke('editAddress', parameters)`.
         *
         * @param  {String}   data.url  Referer URL that call the API. *Note*: Must contain `code` and `state` in querystring.
         * @param  {String}   data.accessToken
         * @param  {Function} callback(err, params)
         *
         * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_9
         */

    }, {
        key: 'getEditAddressParams',
        value: function getEditAddressParams(data) {
            if (!(data && data.url && data.accessToken)) {
                throw new Error('Missing url or accessToken, url=' + (data && data.url) + ', accessToken=' + (data && data.accessToken));
            }

            var params = {
                appId: this.appId,
                scope: 'jsapi_address',
                signType: 'SHA1',
                timeStamp: this._generateTimeStamp(),
                nonceStr: this._generateNonceStr()
            };
            var signParams = {
                appid: params.appId,
                url: data.url,
                timestamp: params.timeStamp,
                noncestr: params.nonceStr,
                accesstoken: data.accessToken
            };
            var string = this._toQueryString(signParams);
            params.addrSign = signTypes[params.signType](string);
            return params;
        }
    }, {
        key: 'getSignKey',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                var params, retobj;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (URLS.GET_SIGN_KEY) {
                                    _context2.next = 2;
                                    break;
                                }

                                throw new Error("not in sandbox mode!");

                            case 2:
                                params = {
                                    mch_id: this.mchId,
                                    nonce_str: this._generateNonceStr()
                                };

                                this.partnerKey = this.orignPartnerKey;
                                _context2.next = 6;
                                return this.sendAndReceiveData(URLS.GET_SIGN_KEY, params);

                            case 6:
                                retobj = _context2.sent;

                                if (retobj.sandbox_signkey) {
                                    debug("set partnerKey from ", this.partnerKey, " to ", retobj.sandbox_signkey);
                                    this.partnerKey = retobj.sandbox_signkey;
                                }
                                return _context2.abrupt('return', retobj);

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getSignKey() {
                return _ref2.apply(this, arguments);
            }

            return getSignKey;
        }()
    }, {
        key: 'unifiedOrder',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                requiredData = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'trade_type'];

                                if (params.trade_type == 'JSAPI') {
                                    requiredData.push('openid|sub_openid');
                                    requiredData.push('appid|sub_appid');
                                } else if (params.trade_type == 'NATIVE') {
                                    requiredData.push('product_id');
                                }
                                params.notify_url = params.notify_url || this.notifyUrl;

                                _context3.next = 5;
                                return this.sendAndReceiveData(URLS.UNIFIED_ORDER, params, requiredData);

                            case 5:
                                return _context3.abrupt('return', _context3.sent);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function unifiedOrder(_x3) {
                return _ref3.apply(this, arguments);
            }

            return unifiedOrder;
        }()
    }, {
        key: 'orderQuery',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.sendAndReceiveData(URLS.ORDER_QUERY, params, ['transaction_id|out_trade_no']);

                            case 2:
                                return _context4.abrupt('return', _context4.sent);

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function orderQuery(_x4) {
                return _ref4.apply(this, arguments);
            }

            return orderQuery;
        }()
    }, {
        key: 'refund',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(params) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                //params = this._extendWithDefault(params, ['op_user_id']);
                                //params = { op_user_id: this.mchId, ...params };
                                params = (0, _extends3.default)({ op_user_id: this.subMchId }, params);

                                _context5.next = 3;
                                return this.sendAndReceiveData(URLS.REFUND, params, ['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee'], true);

                            case 3:
                                return _context5.abrupt('return', _context5.sent);

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function refund(_x5) {
                return _ref5.apply(this, arguments);
            }

            return refund;
        }()
    }, {
        key: 'refundQuery',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params, callback) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.sendAndReceiveData(URLS.REFUND_QUERY, params, ['transaction_id|out_trade_no|out_refund_no|refund_id']);

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function refundQuery(_x6, _x7) {
                return _ref6.apply(this, arguments);
            }

            return refundQuery;
        }()
    }, {
        key: 'downloadBill',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(params) {
                var data, rows, toArr;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.sendAndReceiveData(URLS.DOWNLOAD_BILL, params, ['bill_date', 'bill_type']);

                            case 2:
                                data = _context7.sent;

                                if (!(data.type === 'text')) {
                                    _context7.next = 9;
                                    break;
                                }

                                // parse xml fail, parse csv.
                                rows = data.xml.trim().split(/\r?\n/);

                                toArr = function toArr(rows) {
                                    var titles = rows[0].split(',');
                                    var bodys = rows.splice(1);
                                    var data = [];

                                    bodys.forEach(function (row) {
                                        var rowData = {};
                                        row.split(',').forEach(function (cell, i) {
                                            rowData[titles[i]] = cell.split('`')[1];
                                        });
                                        data.push(rowData);
                                    });
                                    return data;
                                };

                                return _context7.abrupt('return', {
                                    list: toArr(rows.slice(0, rows.length - 2)),
                                    stat: toArr(rows.slice(rows.length - 2, rows.length))[0]
                                });

                            case 9:
                                return _context7.abrupt('return', null);

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function downloadBill(_x8) {
                return _ref7.apply(this, arguments);
            }

            return downloadBill;
        }()
    }, {
        key: 'shortUrl',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.sendAndReceiveData(URLS.SHORT_URL, params, ['long_url']);

                            case 2:
                                return _context8.abrupt('return', _context8.sent);

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function shortUrl(_x9) {
                return _ref8.apply(this, arguments);
            }

            return shortUrl;
        }()
    }, {
        key: 'closeOrder',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(params) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.sendAndReceiveData(URLS.CLOSE_ORDER, params, ['out_trade_no']);

                            case 2:
                                return _context9.abrupt('return', _context9.sent);

                            case 3:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function closeOrder(_x10) {
                return _ref9.apply(this, arguments);
            }

            return closeOrder;
        }()
    }, {
        key: 'sendAndReceiveData',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(url, params) {
                var required = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
                var useCert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                var defaults, key, missing, requestFn, xml, data, errmsg;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                defaults = {
                                    appid: this.appId,
                                    sub_appid: this.subAppId,
                                    mch_id: this.mchId,
                                    sub_mch_id: this.subMchId,
                                    nonce_str: this._generateNonceStr()
                                };

                                params = (0, _extends3.default)({}, defaults, params);
                                params.sign = this._getSign(params);

                                if (params.long_url) {
                                    params.long_url = encodeURIComponent(params.long_url);
                                }

                                for (key in params) {
                                    if (params[key] !== undefined && params[key] !== null) {
                                        params[key] = params[key].toString();
                                    }
                                }

                                missing = [];

                                required.forEach(function (key) {
                                    var alters = key.split('|');
                                    for (var i = alters.length - 1; i >= 0; i--) {
                                        if (params[alters[i]]) {
                                            return;
                                        }
                                    }
                                    missing.push(key);
                                });

                                if (!missing.length) {
                                    _context10.next = 10;
                                    break;
                                }

                                debug('error! missing params ' + missing.join(','));
                                throw new Error('missing params ' + missing.join(','));

                            case 10:
                                requestFn = (useCert ? this._requestWithCert : this._request).bind(this);

                                debug("request:", params);
                                xml = null;
                                data = null;
                                _context10.prev = 14;
                                _context10.next = 17;
                                return requestFn(url, this._buildXml(params));

                            case 17:
                                xml = _context10.sent;
                                _context10.next = 20;
                                return this._parseXml(xml);

                            case 20:
                                data = _context10.sent;
                                _context10.next = 27;
                                break;

                            case 23:
                                _context10.prev = 23;
                                _context10.t0 = _context10['catch'](14);

                                debug("parse xml fail! error=", _context10.t0);
                                return _context10.abrupt('return', { type: 'text', xml: xml });

                            case 27:
                                debug("response: parsed=", data, ", orginXml=", xml);

                                if (!(data.return_code == 'SUCCESS' && data.result_code == 'SUCCESS')) {
                                    _context10.next = 32;
                                    break;
                                }

                                debug("pay success!");
                                _context10.next = 35;
                                break;

                            case 32:
                                debug("error! pay fail!");
                                errmsg = data.err_code_des || data.err_code || data.result_code || data.return_msg;
                                throw new Error('pay fail! ' + errmsg);

                            case 35:
                                return _context10.abrupt('return', data);

                            case 36:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[14, 23]]);
            }));

            function sendAndReceiveData(_x11, _x12) {
                return _ref10.apply(this, arguments);
            }

            return sendAndReceiveData;
        }()
    }, {
        key: 'notifyParse',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(xml) {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this._parseXml(xml);

                            case 2:
                                return _context11.abrupt('return', _context11.sent);

                            case 3:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function notifyParse(_x15) {
                return _ref11.apply(this, arguments);
            }

            return notifyParse;
        }()
    }, {
        key: 'notifyResult',
        value: function notifyResult(params) {
            return this._buildXml(params);
        }

        ////////////////////////////////////////////////////////////
        // util functions:
        ////////////////////////////////////////////////////////////

    }, {
        key: '_request',
        value: function _request(url, data) {
            return new _promise2.default(function (resolve, reject) {
                (0, _request3.default)({
                    url: url,
                    method: 'POST',
                    body: data
                }, function (err, response, body) {
                    if (err) reject(err);else resolve(body);
                });
            });
        }
    }, {
        key: '_requestWithCert',
        value: function _requestWithCert(url, data) {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {
                var parsed_url = _url2.default.parse(url);
                var opts = {
                    host: parsed_url.host,
                    port: 443,
                    path: parsed_url.path,
                    pfx: _this.pfx,
                    passphrase: _this.passphrase,
                    method: 'POST'
                };
                debug("_requestWithCert:", opts);
                var req = _https2.default.request(opts, function (res) {
                    var content = '';
                    res.on('data', function (chunk) {
                        content += chunk;
                    });
                    res.on('end', function () {
                        resolve(content);
                    });
                });

                req.on('error', function (e) {
                    reject(e);
                });
                req.write(data);
                req.end();
            });
        }
    }, {
        key: '_buildXml',
        value: function _buildXml(obj) {
            var builder = new _xml2js2.default.Builder({
                allowSurrogateChars: true
            });
            var xml = builder.buildObject({
                xml: obj
            });
            //console.dir (xml);
            return xml;
        }
    }, {
        key: '_parseXml',
        value: function _parseXml(xml) {
            return new _promise2.default(function (resolve, reject) {
                var parser = new _xml2js2.default.Parser({
                    trim: true,
                    explicitArray: false
                });
                parser.parseString(xml, function (err, result) {
                    //console.dir(result);
                    if (err) reject(err);else resolve(result.xml);
                });
            });
        }
    }, {
        key: '_getSign',
        value: function _getSign(pkg, signType) {
            var sign = pkg.sign,
                pkg2 = (0, _objectWithoutProperties3.default)(pkg, ['sign']);

            signType = signType || 'MD5';
            var string1 = this._toQueryString(pkg2);
            var stringSignTemp = string1 + '&key=' + this.partnerKey;
            var signValue = signTypes[signType](stringSignTemp).toUpperCase();
            return signValue;
        }
    }, {
        key: '_toQueryString',
        value: function _toQueryString(object) {
            return (0, _keys2.default)(object).filter(function (key) {
                return object[key] !== undefined && object[key] !== '';
            }).sort().map(function (key) {
                return key + '=' + object[key];
            }).join('&');
        }
    }, {
        key: '_generateTimeStamp',
        value: function _generateTimeStamp() {
            return "" + Math.floor(new Date() / 1000);
        }

        /**
         * [_generateNonceStr description]
         * @param  {[type]} length [description]
         * @return {[type]}        [description]
         */

    }, {
        key: '_generateNonceStr',
        value: function _generateNonceStr(length) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var maxPos = chars.length;
            var noceStr = '';
            for (var i = 0; i < (length || 32); i++) {
                noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return noceStr;
        }
    }]);
    return Wepay;
}();

exports.default = Wepay;