'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('app:wechat:jssdk');

var Jssdk = function (_Base) {
    (0, _inherits3.default)(Jssdk, _Base);

    function Jssdk() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Jssdk);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Jssdk.__proto__ || (0, _getPrototypeOf2.default)(Jssdk)).call(this, opts));

        _this.apiTickets = {};
        return _this;
    }

    (0, _createClass3.default)(Jssdk, [{
        key: 'getSignPackage',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
                var jsApiTicket, currentTimestamp, raw, createNonceStr, ret, string, jsSHA, shaObj;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this._getJsApiTicket();

                            case 2:
                                jsApiTicket = _context.sent;

                                debug("jsApiTicket", jsApiTicket);
                                currentTimestamp = parseInt(new Date().getTime() / 1000) + '';

                                raw = function raw(args) {
                                    var keys = (0, _keys2.default)(args);
                                    keys = keys.sort();
                                    var newArgs = {};
                                    keys.forEach(function (key) {
                                        newArgs[key.toLowerCase()] = args[key];
                                    });

                                    var string = '';
                                    for (var k in newArgs) {
                                        string += '&' + k + '=' + newArgs[k];
                                    }
                                    string = string.substr(1);
                                    return string;
                                };

                                createNonceStr = function createNonceStr() {
                                    return Math.random().toString(36).substr(2, 15);
                                };

                                ret = {
                                    jsapi_ticket: jsApiTicket,
                                    nonceStr: createNonceStr(),
                                    timestamp: currentTimestamp,
                                    url: url
                                };
                                string = raw(ret);
                                jsSHA = require('jssha');
                                shaObj = new jsSHA(string, 'TEXT');

                                ret.signature = shaObj.getHash('SHA-1', 'HEX');
                                ret.appId = this.appId;

                                return _context.abrupt('return', ret);

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getSignPackage(_x2) {
                return _ref.apply(this, arguments);
            }

            return getSignPackage;
        }()
    }, {
        key: '_getJsApiTicket',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                var cachedTicket, currentTimestamp, expireTime, url, resJson, newTicket;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                cachedTicket = this.apiTickets[this.appId];
                                currentTimestamp = parseInt(new Date().getTime() / 1000);
                                expireTime = cachedTicket && cachedTicket.expire_time || 0;

                                if (!(expireTime < currentTimestamp)) {
                                    _context2.next = 10;
                                    break;
                                }

                                // ticket has expire.
                                debug("ticket has expired, need refresh!");
                                url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=1&access_token=ACCESS_TOKEN";
                                _context2.next = 8;
                                return this.get(url);

                            case 8:
                                resJson = _context2.sent;

                                if (resJson && resJson.ticket) {
                                    newTicket = {};

                                    newTicket.expire_time = currentTimestamp + 7200;
                                    newTicket.ticket = resJson.ticket;
                                    this.apiTickets[this.appId] = newTicket;
                                    cachedTicket = newTicket;
                                } else {
                                    debug("error! _getJsApiTicket: request fail! url=" + url);
                                }

                            case 10:
                                return _context2.abrupt('return', cachedTicket.ticket);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _getJsApiTicket() {
                return _ref2.apply(this, arguments);
            }

            return _getJsApiTicket;
        }()
    }]);
    return Jssdk;
}(_base2.default);

exports.default = Jssdk;