import _debug from 'debug'
const debug = _debug('app:server:wechat:ShortUrl')
import Base from './base'

export default class ShortUrl extends Base {
    constructor (opts = {}) {
        super (opts)
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
    shorturl (longUrl) {
        var url = "https://api.weixin.qq.com/cgi-bin/shorturl?access_token=ACCESS_TOKEN";
        return this.post(url, { action: 'long2short', long_url: longUrl });
    }
}
