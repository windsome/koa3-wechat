'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _wechatCrypto = require('wechat-crypto');

var _wechatCrypto2 = _interopRequireDefault(_wechatCrypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * 响应模版
 */
var tpl = ['<xml>', '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>', '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>', '<CreateTime><%=createTime%></CreateTime>', '<MsgType><![CDATA[<%=msgType%>]]></MsgType>', '<% if (msgType === "news") { %>', '<ArticleCount><%=content.length%></ArticleCount>', '<Articles>', '<% content.forEach(function(item){ %>', '<item>', '<Title><![CDATA[<%-item.title%>]]></Title>', '<Description><![CDATA[<%-item.description%>]]></Description>', '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>', '<Url><![CDATA[<%-item.url%>]]></Url>', '</item>', '<% }); %>', '</Articles>', '<% } else if (msgType === "music") { %>', '<Music>', '<Title><![CDATA[<%-content.title%>]]></Title>', '<Description><![CDATA[<%-content.description%>]]></Description>', '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>', '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>', '</Music>', '<% } else if (msgType === "voice") { %>', '<Voice>', '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>', '</Voice>', '<% } else if (msgType === "image") { %>', '<Image>', '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>', '</Image>', '<% } else if (msgType === "video") { %>', '<Video>', '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>', '<Title><![CDATA[<%-content.title%>]]></Title>', '<Description><![CDATA[<%-content.description%>]]></Description>', '</Video>', '<% } else if (msgType === "transfer_customer_service") { %>', '<% if (content && content.kfAccount) { %>', '<TransInfo>', '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>', '</TransInfo>', '<% } %>', '<% } else { %>', '<Content><![CDATA[<%-content%>]]></Content>', '<% } %>', '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = _ejs2.default.compile(tpl);

var wrapTpl = '<xml>' + '<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>' + '<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>' + '<TimeStamp><%-timestamp%></TimeStamp>' + '<Nonce><![CDATA[<%-nonce%>]]></Nonce>' + '</xml>';

var encryptWrap = _ejs2.default.compile(wrapTpl);

var Wechat = function () {
    function Wechat(config) {
        (0, _classCallCheck3.default)(this, Wechat);

        this.setToken(config);
    }

    (0, _createClass3.default)(Wechat, [{
        key: 'setToken',
        value: function setToken(config) {
            if (typeof config === 'string') {
                this.token = config;
            } else if ((typeof config === 'undefined' ? 'undefined' : (0, _typeof3.default)(config)) === 'object' && config.token) {
                this.token = config.token;
                this.appid = config.appid || '';
                this.encodingAESKey = config.encodingAESKey || '';
            } else {
                throw new Error('please check your config');
            }
        }
    }, {
        key: 'getSignature',
        value: function getSignature(timestamp, nonce, token) {
            var shasum = _crypto2.default.createHash('sha1');
            var arr = [token, timestamp, nonce].sort();
            shasum.update(arr.join(''));

            return shasum.digest('hex');
        }
    }, {
        key: 'parseXML',
        value: function parseXML(xml) {
            var _arguments = arguments;

            return new _promise2.default(function (resolve, reject) {
                _xml2js2.default.parseString(xml, { trim: true }, function (err, res) {
                    if (err) return reject(err);
                    if (_arguments.length > 2) res = slice.call(_arguments, 1);
                    resolve(res);
                });
            });
        }

        /*!
         * 将xml2js解析出来的对象转换成直接可访问的对象
         */

    }, {
        key: 'formatMessage',
        value: function formatMessage(result) {
            var message = {};
            if ((typeof result === 'undefined' ? 'undefined' : (0, _typeof3.default)(result)) === 'object') {
                for (var key in result) {
                    if (!(result[key] instanceof Array) || result[key].length === 0) {
                        continue;
                    }
                    if (result[key].length === 1) {
                        var val = result[key][0];
                        if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object') {
                            message[key] = this.formatMessage(val);
                        } else {
                            message[key] = (val || '').trim();
                        }
                    } else {
                        message[key] = [];
                        result[key].forEach(function (item) {
                            message[key].push(this.formatMessage(item));
                        });
                    }
                }
            }
            return message;
        }

        /*!
         * 将内容回复给微信的封装方法
         */

    }, {
        key: 'reply',
        value: function reply(content, fromUsername, toUsername) {
            var info = {};
            var type = 'text';
            info.content = content || '';
            if (Array.isArray(content)) {
                type = 'news';
            } else if ((typeof content === 'undefined' ? 'undefined' : (0, _typeof3.default)(content)) === 'object') {
                if (content.hasOwnProperty('type')) {
                    if (content.type === 'customerService') {
                        return this.reply2CustomerService(fromUsername, toUsername, content.kfAccount);
                    }
                    type = content.type;
                    info.content = content.content;
                } else {
                    type = 'music';
                }
            }
            info.msgType = type;
            info.createTime = new Date().getTime();
            info.toUsername = toUsername;
            info.fromUsername = fromUsername;
            return compiled(info);
        }
    }, {
        key: 'reply2CustomerService',
        value: function reply2CustomerService(fromUsername, toUsername, kfAccount) {
            var info = {};
            info.msgType = 'transfer_customer_service';
            info.createTime = new Date().getTime();
            info.toUsername = toUsername;
            info.fromUsername = fromUsername;
            info.content = {};
            if (typeof kfAccount === 'string') {
                info.content.kfAccount = kfAccount;
            }
            return compiled(info);
        }
    }, {
        key: 'middleware',
        value: function middleware(handle) {
            var that = this;
            if (this.encodingAESKey) {
                that.cryptor = new _wechatCrypto2.default(this.token, this.encodingAESKey, this.appid);
            }
            return function () {
                var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
                    var query, encrypted, timestamp, nonce, echostr, method, valid, signature, decrypted, xml, result, formated, encryptMessage, decryptedXML, messageWrapXml, decodedXML, replyMessageXml, wrap;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    query = ctx.query;
                                    // 加密模式

                                    encrypted = !!(query.encrypt_type && query.encrypt_type === 'aes' && query.msg_signature);
                                    timestamp = query.timestamp;
                                    nonce = query.nonce;
                                    echostr = query.echostr;
                                    method = ctx.method;

                                    if (!(method === 'GET')) {
                                        _context.next = 12;
                                        break;
                                    }

                                    valid = false;

                                    if (encrypted) {
                                        signature = query.msg_signature;

                                        valid = signature === that.cryptor.getSignature(timestamp, nonce, echostr);
                                    } else {
                                        // 校验
                                        valid = query.signature === that.getSignature(timestamp, nonce, that.token);
                                    }
                                    if (!valid) {
                                        ctx.status = 401;
                                        ctx.body = 'Invalid signature';
                                    } else {
                                        if (encrypted) {
                                            decrypted = that.cryptor.decrypt(echostr);
                                            // TODO 检查appId的正确性

                                            ctx.body = decrypted.message;
                                        } else {
                                            ctx.body = echostr;
                                        }
                                    }
                                    _context.next = 54;
                                    break;

                                case 12:
                                    if (!(method === 'POST')) {
                                        _context.next = 52;
                                        break;
                                    }

                                    if (encrypted) {
                                        _context.next = 18;
                                        break;
                                    }

                                    if (!(query.signature !== that.getSignature(timestamp, nonce, that.token))) {
                                        _context.next = 18;
                                        break;
                                    }

                                    ctx.status = 401;
                                    ctx.body = 'Invalid signature';
                                    return _context.abrupt('return');

                                case 18:
                                    _context.next = 20;
                                    return (0, _rawBody2.default)(ctx.req, {
                                        length: ctx.length,
                                        limit: '1mb',
                                        encoding: ctx.charset
                                    });

                                case 20:
                                    xml = _context.sent;


                                    ctx.weixin_xml = xml;
                                    // 解析xml
                                    _context.next = 24;
                                    return that.parseXML(xml);

                                case 24:
                                    result = _context.sent;
                                    formated = that.formatMessage(result.xml);

                                    if (!encrypted) {
                                        _context.next = 42;
                                        break;
                                    }

                                    encryptMessage = formated.Encrypt;

                                    if (!(query.msg_signature !== that.cryptor.getSignature(timestamp, nonce, encryptMessage))) {
                                        _context.next = 32;
                                        break;
                                    }

                                    ctx.status = 401;
                                    ctx.body = 'Invalid signature';
                                    return _context.abrupt('return');

                                case 32:
                                    decryptedXML = that.cryptor.decrypt(encryptMessage);
                                    messageWrapXml = decryptedXML.message;

                                    if (!(messageWrapXml === '')) {
                                        _context.next = 38;
                                        break;
                                    }

                                    ctx.status = 401;
                                    ctx.body = 'Invalid signature';
                                    return _context.abrupt('return');

                                case 38:
                                    _context.next = 40;
                                    return that.parseXML(messageWrapXml);

                                case 40:
                                    decodedXML = _context.sent;

                                    formated = that.formatMessage(decodedXML.xml);

                                case 42:

                                    // 挂载处理后的微信消息
                                    ctx.weixin = formated;
                                    _context.next = 45;
                                    return handle(ctx, next);

                                case 45:
                                    if (!(ctx.body === '')) {
                                        _context.next = 47;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 47:
                                    replyMessageXml = that.reply(ctx.body, formated.ToUserName, formated.FromUserName);


                                    if (!query.encrypt_type || query.encrypt_type === 'raw') {
                                        ctx.body = replyMessageXml;
                                    } else {
                                        wrap = {};

                                        wrap.encrypt = that.cryptor.encrypt(replyMessageXml);
                                        wrap.nonce = parseInt(Math.random() * 100000000000, 10);
                                        wrap.timestamp = new Date().getTime();
                                        wrap.signature = that.cryptor.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt);
                                        ctx.body = encryptWrap(wrap);
                                    }

                                    ctx.type = 'application/xml';

                                    _context.next = 54;
                                    break;

                                case 52:
                                    ctx.status = 501;
                                    ctx.body = 'Not Implemented';

                                case 54:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }();
        }
    }]);
    return Wechat;
}();

Wechat.propTypes = {
    goBack: -1
};
exports.default = Wechat;