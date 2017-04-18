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

var debug = (0, _debug3.default)('wechat:base');

var Qrcode = function (_Base) {
    (0, _inherits3.default)(Qrcode, _Base);

    function Qrcode() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Qrcode);
        return (0, _possibleConstructorReturn3.default)(this, (Qrcode.__proto__ || (0, _getPrototypeOf2.default)(Qrcode)).call(this, opts));
    }

    /**
     * 创建临时二维码
     * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码>
     * Examples:
     * ```
     * api.createTmpQRCode(10000, 1800);
     * ```
      * Result:
     * ```
     * {
     *  "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA==",
     *  "expire_seconds":1800
     * }
     * ```
     * @param {Number} sceneId 场景ID
     * @param {Number} expire 过期时间，单位秒。最大不超过1800
     */


    (0, _createClass3.default)(Qrcode, [{
        key: 'createTmpQRCode',
        value: function createTmpQRCode(sceneId) {
            var expire = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1800;

            var url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=ACCESS_TOKEN";
            var obj = {
                expire_seconds: expire,
                action_name: 'QR_SCENE',
                action_info: {
                    scene: {
                        scene_id: sceneId
                    }
                }
            };
            return this.post(url, obj);
        }

        /**
         * 创建永久二维码
         * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码>
         * Examples:
         * ```
         * api.createLimitQRCode(100);
         * ```
          * Result:
         * ```
         * {
         *  "ticket":"gQG28DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0FuWC1DNmZuVEhvMVp4NDNMRnNRAAIEesLvUQMECAcAAA=="
         * }
         * ```
         * @param {Number} sceneId 场景ID。ID不能大于100000
         */

    }, {
        key: 'createLimitQRCode',
        value: function createLimitQRCode(sceneId) {
            var url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=ACCESS_TOKEN";
            var obj = {
                action_name: 'QR_LIMIT_SCENE',
                action_info: {
                    scene: {
                        scene_id: sceneId
                    }
                }
            };
            return this.post(url, obj);
        }

        /**
         * 生成显示二维码的链接。微信扫描后，可立即进入场景
         * Examples:
         * ```
         * api.showQRCodeURL(ticket);
         * // => https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET
         * ```
         * @param {String} ticket 二维码Ticket
         * @return {String} 显示二维码的URL地址，通过img标签可以显示出来 */

    }, {
        key: 'showQRCodeURL',
        value: function showQRCodeURL(ticket) {
            return "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket;
        }
    }]);
    return Qrcode;
}(_base2.default);

exports.default = Qrcode;