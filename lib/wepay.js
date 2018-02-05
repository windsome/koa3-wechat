'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('app:wepay');

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
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/pay/closeorder',
    REDPACK_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack',
    REDPACK_GROUP_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack',
    REDPACK_QUERY: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo',
    TRANSFERS: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
    GET_TRANSFER_INFO: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo',
    PAY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank',
    QUERY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/query_bank'
};

var URLS_SANDBOX = {
    GET_SIGN_KEY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey',
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
    ORDER_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
    REFUND: 'https://api.mch.weixin.qq.com/secapi/sandboxnew/pay/refund',
    REFUND_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
    DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadbill',
    SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder',
    REDPACK_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack',
    REDPACK_GROUP_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack',
    REDPACK_QUERY: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo',
    TRANSFERS: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
    GET_TRANSFER_INFO: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo',
    PAY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank',
    QUERY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/query_bank'
};

var PAY_BANK_GETPUBLICKEY = 'https://fraud.mch.weixin.qq.com/risk/getpublickey';

//let URLS = URLS_SANDBOX;
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

    /**
     * 微信内H5调起支付
     * 见： <https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6>
     * 在微信浏览器里面打开H5网页中执行JS调起支付。接口输入输出数据格式为JSON。
     * 注意：WeixinJSBridge内置对象在其他浏览器中无效。
     * @param {*} order 订单信息
     */


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

        /**
         * 获取sandbox测试key
         */

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

        /**
         * 统一下单接口
         * 见：<https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1>
         * 除被扫支付场景以外，商户系统先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易回话标识后再按扫码、JSAPI、APP等不同场景生成交易串调起支付。
         * @param {*} params 订单信息
         */

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
                                return this.sendAndReceiveData(URLS.UNIFIED_ORDER, params, { required: requiredData });

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

        /**
         * 订单查询
         * @param {*} params 订单信息
         * transaction_id （微信订单号）或 out_trade_no （用户订单号）
         */

    }, {
        key: 'orderQuery',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.sendAndReceiveData(URLS.ORDER_QUERY, params, { required: ['transaction_id|out_trade_no'] });

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

        /**
         * 退款
         * @param {*} params 退款单信息
         * 必填信息：['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee']
         */

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
                                return this.sendAndReceiveData(URLS.REFUND, params, { required: ['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee'], useCert: true });

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

        /**
         * 退款查询
         * @param {*} params 
         * 必填信息：['transaction_id|out_trade_no|out_refund_no|refund_id']
         */

    }, {
        key: 'refundQuery',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.sendAndReceiveData(URLS.REFUND_QUERY, params, { required: ['transaction_id|out_trade_no|out_refund_no|refund_id'] });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function refundQuery(_x6) {
                return _ref6.apply(this, arguments);
            }

            return refundQuery;
        }()

        /**
         * 下载订单流水
         * @param {*} params 退款查询字段
         * 必填信息：['bill_date', 'bill_type']
         */

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
                                return this.sendAndReceiveData(URLS.DOWNLOAD_BILL, params, { required: ['bill_date', 'bill_type'] });

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

            function downloadBill(_x7) {
                return _ref7.apply(this, arguments);
            }

            return downloadBill;
        }()
    }, {
        key: 'shortUrl',


        /**
         * 长连接转短链接
         * @param {*} params 
         * 必填信息：['long_url']
         */
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.sendAndReceiveData(URLS.SHORT_URL, params, { required: ['long_url'] });

                            case 2:
                                return _context8.abrupt('return', _context8.sent);

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function shortUrl(_x8) {
                return _ref8.apply(this, arguments);
            }

            return shortUrl;
        }()
    }, {
        key: 'closeOrder',


        /**
         * 关闭订单
         * @param {*} params 
         * 必填信息：['out_trade_no']
         */
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(params) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.sendAndReceiveData(URLS.CLOSE_ORDER, params, { required: ['out_trade_no'] });

                            case 2:
                                return _context9.abrupt('return', _context9.sent);

                            case 3:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function closeOrder(_x9) {
                return _ref9.apply(this, arguments);
            }

            return closeOrder;
        }()
    }, {
        key: 'sendRedPacket',


        /**
         * 发放普通红包
         * TODO: 注意里面没有appid, 但存在wxappid,
         * @param {*} params 
         */
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                requiredData = ['wxappid', 'mch_billno', 'send_name', 're_openid', 'total_amount', 'total_num', 'wishing', 'client_ip', 'act_name', 'remark'];
                                _context10.next = 3;
                                return this.sendAndReceiveData(URLS.REDPACK_SEND, (0, _extends3.default)({}, params, { wxappid: this.appId }), { required: requiredData, useCert: true, removed: ['appid'] });

                            case 3:
                                return _context10.abrupt('return', _context10.sent);

                            case 4:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function sendRedPacket(_x10) {
                return _ref10.apply(this, arguments);
            }

            return sendRedPacket;
        }()
    }, {
        key: 'sendRedPacketGroup',

        /**
         * 发放裂变红包
         * 裂变红包：一次可以发放一组红包。首先领取的用户为种子用户，种子用户领取一组红包当中的一个，并可以通过社交分享将剩下的红包给其他用户。裂变红包充分利用了人际传播的优势。 
         * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=13_5&index=4>
         * @param {*} params 
         */
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                requiredData = ['wxappid', 'mch_billno', 'send_name', 're_openid', 'total_amount', 'total_num', 'amt_type', 'wishing', 'act_name', 'remark'];
                                _context11.next = 3;
                                return this.sendAndReceiveData(URLS.REDPACK_GROUP_SEND, (0, _extends3.default)({}, params, { wxappid: this.appId }), { required: requiredData, useCert: true, removed: ['appid'] });

                            case 3:
                                return _context11.abrupt('return', _context11.sent);

                            case 4:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function sendRedPacketGroup(_x11) {
                return _ref11.apply(this, arguments);
            }

            return sendRedPacketGroup;
        }()
    }, {
        key: 'redPacketQuery',

        /**
         * 查询红包记录
         * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=13_6&index=5>
         * @param {*} params 
         */
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                requiredData = ['mch_billno'];
                                _context12.next = 3;
                                return this.sendAndReceiveData(URLS.REDPACK_QUERY, (0, _extends3.default)({}, params, { bill_type: 'MCHT' }), { required: requiredData, useCert: true });

                            case 3:
                                return _context12.abrupt('return', _context12.sent);

                            case 4:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function redPacketQuery(_x12) {
                return _ref12.apply(this, arguments);
            }

            return redPacketQuery;
        }()
    }, {
        key: 'transfers',


        ////////////////////////////////////////////////////////////
        // 企业付款
        ////////////////////////////////////////////////////////////
        /**
         * 企业付款到用户微信零钱
         * 企业付款业务是基于微信支付商户平台的资金管理能力，为了协助商户方便地实现企业向个人付款，针对部分有开发能力的商户，提供通过API完成企业付款的功能。 
         * 比如目前的保险行业向客户退保、给付、理赔。
         * 企业付款将使用商户的可用余额，需确保可用余额充足。查看可用余额、充值、提现请登录商户平台“资金管理”进行操作。
         * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2>
         * @param {*} params 支付参数
         * 必选参数: ['partner_trade_no', 'openid', 'check_name', 'amount', 'desc', 'spbill_create_ip']
         */
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                requiredData = ['partner_trade_no', 'openid', 'check_name', 'amount', 'desc', 'spbill_create_ip'];
                                _context13.next = 3;
                                return this.sendAndReceiveData(URLS.TRANSFERS, params, { required: requiredData, useCert: true });

                            case 3:
                                return _context13.abrupt('return', _context13.sent);

                            case 4:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function transfers(_x13) {
                return _ref13.apply(this, arguments);
            }

            return transfers;
        }()
    }, {
        key: 'getTransferInfo',

        /**
         * 查询企业付款
         * 用于商户的企业付款操作进行结果查询，返回付款操作详细结果。
         * 查询企业付款API只支持查询30天内的订单，30天之前的订单请登录商户平台查询。
         * @param {*} params 
         * 必选参数: ['partner_trade_no']
         */
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                requiredData = ['partner_trade_no'];
                                _context14.next = 3;
                                return this.sendAndReceiveData(URLS.GET_TRANSFER_INFO, params, { required: requiredData, useCert: true });

                            case 3:
                                return _context14.abrupt('return', _context14.sent);

                            case 4:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function getTransferInfo(_x14) {
                return _ref14.apply(this, arguments);
            }

            return getTransferInfo;
        }()
    }, {
        key: 'payBank',


        /**
         * 企业付款到银行卡
         * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=24_2>
         * @param {*} params 支付参数
         * 必选参数: ['partner_trade_no', 'enc_bank_no', 'enc_true_name', 'bank_code', 'amount']
         */
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(params) {
                var _ref16, bank_no, true_name, rest, publicKey, enc_bank_no, enc_true_name, newParams, requiredData;

                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _ref16 = params || {}, bank_no = _ref16.bank_no, true_name = _ref16.true_name, rest = (0, _objectWithoutProperties3.default)(_ref16, ['bank_no', 'true_name']);

                                if (!(!bank_no || !true_name)) {
                                    _context15.next = 3;
                                    break;
                                }

                                throw new Error('missing required bank_no or true_name!');

                            case 3:
                                _context15.next = 5;
                                return this.payBank_getPublicKey();

                            case 5:
                                publicKey = _context15.sent;
                                enc_bank_no = _crypto2.default.publicEncrypt(publicKey, new Buffer(bank_no)).toString("base64");
                                enc_true_name = _crypto2.default.publicEncrypt(publicKey, new Buffer(true_name)).toString("base64");
                                newParams = (0, _extends3.default)({}, rest, { enc_bank_no: enc_bank_no, enc_true_name: enc_true_name });
                                requiredData = ['partner_trade_no', 'enc_bank_no', 'enc_true_name', 'bank_code', 'amount'];
                                _context15.next = 12;
                                return this.sendAndReceiveData(URLS.PAY_BANK, newParams, { required: requiredData, useCert: true });

                            case 12:
                                return _context15.abrupt('return', _context15.sent);

                            case 13:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function payBank(_x15) {
                return _ref15.apply(this, arguments);
            }

            return payBank;
        }()
    }, {
        key: 'payBank_getPublicKey',

        /**
         * 获取RSA公钥API
         * 用来加密银行卡号，姓名等信息，payBank中会用。
         * 将密文传给微信侧相应字段，如付款接口（enc_bank_no/enc_true_name）
         * 接口默认输出PKCS#1格式的公钥，商户需根据自己开发的语言选择公钥格式 
         */
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16() {
                var result;
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                if (this._bankPublicKey) {
                                    _context16.next = 6;
                                    break;
                                }

                                _context16.next = 3;
                                return this.sendAndReceiveData(PAY_BANK_GETPUBLICKEY, null, null, true);

                            case 3:
                                result = _context16.sent;

                                console.log("get public key result:", result);
                                if (result.return_code == 'SUCCESS' && result.result_code == 'SUCCESS') {
                                    this._bankPublicKey = result.pub_key;
                                }

                            case 6:
                                return _context16.abrupt('return', this._bankPublicKey);

                            case 7:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function payBank_getPublicKey() {
                return _ref17.apply(this, arguments);
            }

            return payBank_getPublicKey;
        }()
    }, {
        key: 'queryBank',

        /**
         * 查询企业付款银行卡API
         * 用于对商户企业付款到银行卡操作进行结果查询，返回付款操作详细结果。
         * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=24_3>
         * @param {*} params 
         * 必选参数: ['partner_trade_no']
         */
        value: function () {
            var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(params) {
                var requiredData;
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                requiredData = ['partner_trade_no'];
                                _context17.next = 3;
                                return this.sendAndReceiveData(URLS.QUERY_BANK, params, { required: requiredData, useCert: true });

                            case 3:
                                return _context17.abrupt('return', _context17.sent);

                            case 4:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function queryBank(_x16) {
                return _ref18.apply(this, arguments);
            }

            return queryBank;
        }()
    }, {
        key: 'sendAndReceiveData',


        ////////////////////////////////////////////////////////////
        // send and receive data:
        ////////////////////////////////////////////////////////////
        value: function () {
            var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(url, params, options) {
                var _ref20, _ref20$required, required, _ref20$useCert, useCert, _ref20$removed, removed, defaults, key, missing, requestFn, xml, data, errmsg;

                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _ref20 = options || {}, _ref20$required = _ref20.required, required = _ref20$required === undefined ? [] : _ref20$required, _ref20$useCert = _ref20.useCert, useCert = _ref20$useCert === undefined ? false : _ref20$useCert, _ref20$removed = _ref20.removed, removed = _ref20$removed === undefined ? [] : _ref20$removed;
                                defaults = {
                                    appid: this.appId,
                                    mch_id: this.mchId,
                                    nonce_str: this._generateNonceStr()
                                };

                                if (this.subAppId && this.subMchId) {
                                    defaults = (0, _extends3.default)({}, defaults, { sub_appid: this.subAppId, sub_mch_id: this.subMchId });
                                }
                                params = params || {};
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

                                removed && removed.forEach(function (key) {
                                    if (params.hasOwnProperty(key)) {
                                        delete params[key];
                                    }
                                });

                                missing = [];

                                required && required.forEach(function (key) {
                                    var alters = key.split('|');
                                    for (var i = alters.length - 1; i >= 0; i--) {
                                        if (params[alters[i]]) {
                                            return;
                                        }
                                    }
                                    missing.push(key);
                                });

                                if (!missing.length) {
                                    _context18.next = 14;
                                    break;
                                }

                                debug('error! missing params ' + missing.join(','));
                                throw new Error('missing params ' + missing.join(','));

                            case 14:
                                requestFn = (useCert ? this._requestWithCert : this._request).bind(this);

                                debug("request:", params);
                                xml = null;
                                data = null;
                                _context18.prev = 18;
                                _context18.next = 21;
                                return requestFn(url, this._buildXml(params));

                            case 21:
                                xml = _context18.sent;
                                _context18.next = 24;
                                return this._parseXml(xml);

                            case 24:
                                data = _context18.sent;
                                _context18.next = 31;
                                break;

                            case 27:
                                _context18.prev = 27;
                                _context18.t0 = _context18['catch'](18);

                                debug("parse xml fail! error=", _context18.t0);
                                return _context18.abrupt('return', { type: 'text', xml: xml });

                            case 31:
                                debug("response: parsed=", data, ", orginXml=", xml);

                                if (!(data.return_code == 'SUCCESS' && data.result_code == 'SUCCESS')) {
                                    _context18.next = 36;
                                    break;
                                }

                                debug("pay success!");
                                _context18.next = 39;
                                break;

                            case 36:
                                debug("error! pay fail!");
                                errmsg = data.err_code_des || data.err_code || data.result_code || data.return_msg;
                                throw new Error('pay fail! ' + errmsg);

                            case 39:
                                return _context18.abrupt('return', data);

                            case 40:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee18, this, [[18, 27]]);
            }));

            function sendAndReceiveData(_x17, _x18, _x19) {
                return _ref19.apply(this, arguments);
            }

            return sendAndReceiveData;
        }()
    }, {
        key: 'notifyParse',
        value: function () {
            var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(xml) {
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.next = 2;
                                return this._parseXml(xml);

                            case 2:
                                return _context19.abrupt('return', _context19.sent);

                            case 3:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function notifyParse(_x20) {
                return _ref21.apply(this, arguments);
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