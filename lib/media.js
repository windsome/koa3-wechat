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

var debug = (0, _debug3.default)('app:server:wechat:media');


var path = require('path');
var formstream = require('formstream');
var fs = require("fs");

var Media = function (_Base) {
    (0, _inherits3.default)(Media, _Base);

    function Media() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Media);
        return (0, _possibleConstructorReturn3.default)(this, (Media.__proto__ || (0, _getPrototypeOf2.default)(Media)).call(this, opts));
    }

    /**
     * 新增临时素材，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
     * 详情请见：<http://mp.weixin.qq.com/wiki/5/963fc70b80dc75483a271298a76a8d59.html>
     * Examples:
     * ```
     * api.uploadMedia('filepath', type);
     * ```
     *
     * Result:
     * ```
     * {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
     * ```
     * Shortcut:
     * - `exports.uploadImageMedia(filepath);`
     * - `exports.uploadVoiceMedia(filepath);`
     * - `exports.uploadVideoMedia(filepath);`
     * - `exports.uploadThumbMedia(filepath);`
     *
     * 不再推荐使用：
     *
     * - `exports.uploadImage(filepath);`
     * - `exports.uploadVoice(filepath);`
     * - `exports.uploadVideo(filepath);`
     * - `exports.uploadThumb(filepath);`
     *
     * @param {String|Buffer} filepath 文件路径/文件Buffer数据
     * @param {String} type 媒体类型，可用值有image、voice、video、thumb
     * @param {String} filename 文件名
     * @param {String} mime 文件类型,filepath为Buffer数据时才需要传
     */


    (0, _createClass3.default)(Media, [{
        key: 'uploadMedia',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filepath, type, filename, mime) {
                var form, stat, url, opts;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                form = formstream();

                                if (!Buffer.isBuffer(filepath)) {
                                    _context.next = 5;
                                    break;
                                }

                                form.buffer('media', filepath, filename, mime);
                                _context.next = 10;
                                break;

                            case 5:
                                if (!(typeof filepath == 'string')) {
                                    _context.next = 10;
                                    break;
                                }

                                _context.next = 8;
                                return fs.stat(filepath);

                            case 8:
                                stat = _context.sent;

                                form.file('media', filepath, filename || path.basename(filepath), stat.size);

                            case 10:
                                url = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE".replace(/TYPE/g, type);
                                opts = {
                                    method: 'POST',
                                    timeout: 60000, // 60秒超时
                                    headers: form.headers(),
                                    data: form
                                };

                                opts.headers.Accept = 'application/json';
                                _context.next = 15;
                                return this.request(url, opts);

                            case 15:
                                return _context.abrupt('return', _context.sent);

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function uploadMedia(_x2, _x3, _x4, _x5) {
                return _ref.apply(this, arguments);
            }

            return uploadMedia;
        }()

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

    }, {
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

        /**
         * 上传图文消息内的图片获取URL
         * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
         * Examples:
         * ```
         * api.uploadImage('filepath');
         * ```
         * Result:
         * ```
         * {"url":  "http://mmbiz.qpic.cn/mmbiz/gLO17UPS6FS2xsypf378iaNhWacZ1G1UplZYWEYfwvuU6Ont96b1roYsCNFwaRrSaKTPCUdBK9DgEHicsKwWCBRQ/0"}
         * ```
         * @param {String} filepath 图片文件路径
         */

    }, {
        key: 'uploadImage',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(filepath) {
                var stat, form, url, opts;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return fs.stat(filepath);

                            case 2:
                                stat = _context2.sent;
                                form = formstream();

                                form.file('media', filepath, path.basename(filepath), stat.size);
                                url = "https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN";
                                opts = {
                                    method: 'POST',
                                    timeout: 60000, // 60秒超时
                                    headers: form.headers(),
                                    data: form
                                };

                                opts.headers.Accept = 'application/json';
                                _context2.next = 10;
                                return this.request(url, opts);

                            case 10:
                                return _context2.abrupt('return', _context2.sent);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function uploadImage(_x7) {
                return _ref2.apply(this, arguments);
            }

            return uploadImage;
        }()
    }]);
    return Media;
}(_base2.default);

exports.default = Media;