import _debug from 'debug'
const debug = _debug('app:server:wechat:media')
import Base from './base'

const path = require('path');
const formstream = require('formstream');
const fs = require("fs")

export default class Media extends Base {
    constructor (opts = {}) {
        super (opts)
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
    async uploadMedia (filepath, type, filename, mime) {
        var form = formstream();
        if (Buffer.isBuffer(filepath)) {
            form.buffer('media', filepath, filename, mime);
        } else if (typeof filepath == 'string') {
            var stat = await fs.stat(filepath);
            form.file('media', filepath, filename || path.basename(filepath), stat.size);
        }
        
        var url = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE".replace(/TYPE/g, type);
        var opts = {
            method: 'POST',
            timeout: 60000, // 60秒超时
            headers: form.headers(),
            data: form
        };
        opts.headers.Accept = 'application/json';
        return await this.request(url, opts);
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
    getMedia (mediaId, timeout = 60000) {
        var url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID".replace(/MEDIA_ID/g, mediaId);
        var opts = {
            timeout: timeout // 60秒超时
        };
        debug ("what this?");
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
    async uploadImage (filepath) {
        var stat = await fs.stat(filepath);
        var form = formstream();
        form.file('media', filepath, path.basename(filepath), stat.size);
        var url = "https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN";
        var opts = {
            method: 'POST',
            timeout: 60000, // 60秒超时
            headers: form.headers(),
            data: form
        };
        opts.headers.Accept = 'application/json';
        return await this.request(url, opts);
    }
}
