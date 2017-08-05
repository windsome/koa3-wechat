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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('app:server:wechat:ShortUrl');

var ShortUrl = function (_Base) {
    (0, _inherits3.default)(ShortUrl, _Base);

    function ShortUrl() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, ShortUrl);
        return (0, _possibleConstructorReturn3.default)(this, (ShortUrl.__proto__ || (0, _getPrototypeOf2.default)(ShortUrl)).call(this, opts));
    }

    /**
     * 短网址服务
     * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=长链接转短链接接口
     * Examples:
     * ```
     * api.shorturl('http://mp.weixin.com');
     * ```
      * @param {String} longUrl 需要转换的长链接，支持http://、https://、weixin://wxpay格式的url
     */


    (0, _createClass3.default)(ShortUrl, [{
        key: 'shorturl',
        value: function shorturl(longUrl) {
            var url = "https://api.weixin.qq.com/cgi-bin/shorturl?access_token=ACCESS_TOKEN";
            return this.post(url, { action: 'long2short', long_url: longUrl });
        }
    }]);
    return ShortUrl;
}(_base2.default);

exports.default = ShortUrl;