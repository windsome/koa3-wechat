import _debug from 'debug'
const debug = _debug('app:server:wechat:media')
import Base from './base'

export default class Media extends Base {
    constructor (opts = {}) {
        super (opts)
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
}
