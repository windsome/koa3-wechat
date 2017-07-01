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

var debug = (0, _debug3.default)('app:server:wechat:media');

var Media = function (_Base) {
    (0, _inherits3.default)(Media, _Base);

    function Media() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Media);
        return (0, _possibleConstructorReturn3.default)(this, (Media.__proto__ || (0, _getPrototypeOf2.default)(Media)).call(this, opts));
    }

    /**
     * 获取临时素材
     * 详情请见：<http://mp.weixin.qq.com/wiki/11/07b6b76a6b6e8848e855a435d5e34a5f.html>
     * Examples:
     * ```
     * api.getMedia('media_id');
     * ```
     * - `result`, 调用正常时得到的文件Buffer对象
     * - `res`, HTTP响应对象
     * @param {String} mediaId 媒体文件的ID
     */


    (0, _createClass3.default)(Media, [{
        key: 'getMedia',
        value: function getMedia(mediaId) {
            var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60000;

            var url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID".replace(/MEDIA_ID/g, mediaId);
            var opts = {
                timeout: timeout // 60秒超时
            };
            debug("what this?");
            return this.get(url, opts);
        }
    }]);
    return Media;
}(_base2.default);

exports.default = Media;