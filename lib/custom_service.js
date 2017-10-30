'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var debug = (0, _debug3.default)('app:server:wechat:custom_service');


var path = require('path');
var fs = require('fs');
var formstream = require('formstream');

var ShortUrl = function (_Base) {
    (0, _inherits3.default)(ShortUrl, _Base);

    function ShortUrl() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, ShortUrl);
        return (0, _possibleConstructorReturn3.default)(this, (ShortUrl.__proto__ || (0, _getPrototypeOf2.default)(ShortUrl)).call(this, opts));
    }

    /**
     * 获取客服聊天记录
     * 详细请看：http://mp.weixin.qq.com/wiki/19/7c129ec71ddfa60923ea9334557e8b23.html
     * Opts:
     * ```
     * {
     *  "starttime" : 123456789,
     *  "endtime" : 987654321,
     *  "openid": "OPENID", // 非必须
     *  "pagesize" : 10,
     *  "pageindex" : 1,
     * }
     * ```
     * Examples:
     * ```
     * var result = await api.getRecords(opts);
     * ```
     * Result:
     * ```
     * {
     *  "recordlist": [
     *    {
     *      "worker": " test1",
     *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
     *      "opercode": 2002,
     *      "time": 1400563710,
     *      "text": " 您好，客服test1为您服务。"
     *    },
     *    {
     *      "worker": " test1",
     *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
     *      "opercode": 2003,
     *      "time": 1400563731,
     *      "text": " 你好，有什么事情？ "
     *    },
     *  ]
     * }
     * ```
     * @param {Object} opts 查询条件
     */


    (0, _createClass3.default)(ShortUrl, [{
        key: 'getRecords',
        value: function getRecords(opts) {
            var url = "https://api.weixin.qq.com/customservice/msgrecord/getrecord?access_token=ACCESS_TOKEN";
            return this.post(url, opts);
        }

        /**
         * 获取客服基本信息
         * 详细请看：http://dkf.qq.com/document-3_1.html
         * Examples:
         * ```
         * var result = await api.getCustomServiceList();
         * ```
         * Result:
         * ```
         * {
         *   "kf_list": [
         *     {
         *       "kf_account": "test1@test",
         *       "kf_nick": "ntest1",
         *       "kf_id": "1001"
         *     },
         *     {
         *       "kf_account": "test2@test",
         *       "kf_nick": "ntest2",
         *       "kf_id": "1002"
         *     },
         *     {
         *       "kf_account": "test3@test",
         *       "kf_nick": "ntest3",
         *       "kf_id": "1003"
         *     }
         *   ]
         * }
         * ```
         */

    }, {
        key: 'getCustomServiceList',
        value: function getCustomServiceList() {
            var url = "https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token= ACCESS_TOKEN";
            return this.get(url);
        }

        /**
         * 获取在线客服接待信息
         * 详细请看：http://dkf.qq.com/document-3_2.html * Examples:
         * ```
         * var result = await api.getOnlineCustomServiceList();
         * ```
         * Result:
         * ```
         * {
         *   "kf_online_list": [
         *     {
         *       "kf_account": "test1@test",
         *       "status": 1,
         *       "kf_id": "1001",
         *       "auto_accept": 0,
         *       "accepted_case": 1
         *     },
         *     {
         *       "kf_account": "test2@test",
         *       "status": 1,
         *       "kf_id": "1002",
         *       "auto_accept": 0,
         *       "accepted_case": 2
         *     }
         *   ]
         * }
         * ```
         */

    }, {
        key: 'getOnlineCustomServiceList',
        value: function getOnlineCustomServiceList() {
            var url = "https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token= ACCESS_TOKEN";
            return this.get(url);
        }

        /**
         * 添加客服账号
         * 详细请看：http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044813&token=&lang=zh_CN * Examples:
         * ```
         * var result = await api.addKfAccount('test@test', 'nickname', 'password');
         * ```
         * Result:
         * ```
         * {
         *  "errcode" : 0,
         *  "errmsg" : "ok",
         * }
         * ```
         * @param {String} account 账号名字，格式为：前缀@公共号名字
         * @param {String} nick 昵称
         */

    }, {
        key: 'addKfAccount',
        value: function addKfAccount(account, nick) {
            var url = "https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN";
            return this.post(url, {
                kf_account: account,
                nickname: nick
            });
        }

        /**
         * 邀请绑定客服帐号
         * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044813&token=&lang=zh_CN
         * Examples:
         * ```
         * var result = await api.inviteworker('test@test', 'invite_wx');
         * ```
         * Result:
         * ```
         * {
         *  "errcode" : 0,
         *  "errmsg" : "ok",
         * }
         * ```
         * @param {String} account 账号名字，格式为：前缀@公共号名字
         * @param {String} wx 邀请绑定的个人微信账号
         */

    }, {
        key: 'inviteworker',
        value: function inviteworker(account, wx) {
            var url = "https://api.weixin.qq.com/customservice/kfaccount/inviteworker?access_token=ACCESS_TOKEN";
            return this.post(url, {
                kf_account: account,
                invite_wx: wx
            });
        }

        /**
         * 设置客服账号
         * 详细请看：http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044813&token=&lang=zh_CN * Examples:
         * ```
         * api.updateKfAccount('test@test', 'nickname', 'password');
         * ```
         * Result:
         * ```
         * {
         *  "errcode" : 0,
         *  "errmsg" : "ok",
         * }
         * ```
         * @param {String} account 账号名字，格式为：前缀@公共号名字
         * @param {String} nick 昵称
         */

    }, {
        key: 'updateKfAccount',
        value: function updateKfAccount(account, nick) {
            var url = "https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN";
            return this.post(url, {
                kf_account: account,
                nickname: nick
            });
        }

        /**
         * 删除客服账号
         * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html * Examples:
         * ```
         * api.deleteKfAccount('test@test');
         * ```
         * Result:
         * ```
         * {
         *  "errcode" : 0,
         *  "errmsg" : "ok",
         * }
         * ```
         * @param {String} account 账号名字，格式为：前缀@公共号名字
         */

    }, {
        key: 'deleteKfAccount',
        value: function deleteKfAccount(account, nickname, password) {
            var url = "https://api.weixin.qq.com/customservice/kfaccount/del?access_token=ACCESS_TOKEN";
            return this.post(url, { kf_account: account, nickname: nickname, password: password });
        }

        /**
         * 设置客服头像
         * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html * Examples:
         * ```
         * api.setKfAccountAvatar('test@test', '/path/to/avatar.png');
         * ```
         * Result:
         * ```
         * {
         *  "errcode" : 0,
         *  "errmsg" : "ok",
         * }
         * ```
         * @param {String} account 账号名字，格式为：前缀@公共号名字
         * @param {String} filepath 头像路径
         */

    }, {
        key: 'setKfAccountAvatar',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(account, filepath) {
                var url, stat, form, opts;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                url = "http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT".replace(/KFACCOUNT/g, account);
                                _context.next = 3;
                                return fs.stat(filepath);

                            case 3:
                                stat = _context.sent;
                                form = formstream();

                                form.file('media', filepath, path.basename(filepath), stat.size);
                                opts = {
                                    dataType: 'json',
                                    method: 'POST',
                                    timeout: 60000, // 60秒超时
                                    headers: form.headers(),
                                    stream: form
                                };
                                _context.next = 9;
                                return this.request(url, opts);

                            case 9:
                                return _context.abrupt('return', _context.sent);

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function setKfAccountAvatar(_x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return setKfAccountAvatar;
        }()

        /**
         * 创建客服会话
         * 详细请看：http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN * Examples:
         * ```
         * api.createKfSession('test@test', 'OPENID');
         * ```
         * Result:
         * ```
         * {
         *  "errcode" : 0,
         *  "errmsg" : "ok",
         * }
         * ```
         * @param {String} account 账号名字，格式为：前缀@公共号名字
         * @param {String} openid openid
         */

    }, {
        key: 'createKfSession',
        value: function createKfSession(account, openid) {
            var url = "https://api.weixin.qq.com/customservice/kfsession/create?access_token=ACCESS_TOKEN";
            return this.post(url, {
                kf_account: account,
                openid: openid
            });
        }
    }]);
    return ShortUrl;
}(_base2.default);

exports.default = ShortUrl;