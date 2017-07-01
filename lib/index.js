'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wechat = require('./wechat');

var _wechat2 = _interopRequireDefault(_wechat);

var _oauth = require('./oauth');

var _oauth2 = _interopRequireDefault(_oauth);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _jssdk = require('./jssdk');

var _jssdk2 = _interopRequireDefault(_jssdk);

var _qrcode = require('./qrcode');

var _qrcode2 = _interopRequireDefault(_qrcode);

var _wepay = require('./wepay');

var _wepay2 = _interopRequireDefault(_wepay);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

var _media = require('./media');

var _media2 = _interopRequireDefault(_media);

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    wechat: _wechat2.default,
    oauth: _oauth2.default,
    user: _user2.default,
    jssdk: _jssdk2.default,
    qrcode: _qrcode2.default,
    wepay: _wepay2.default,
    template: _template2.default,
    media: _media2.default,
    menu: _menu2.default
};