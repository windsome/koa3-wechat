import _debug from 'debug';
const debug = _debug('app:wechat:qrcode');
import Base from './base';

export default class Qrcode extends Base {
  constructor(opts = {}) {
    super(opts);
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
  createTmpQRCode(sceneId, expire = 1800) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=ACCESS_TOKEN';
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
  createLimitQRCode(sceneId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=ACCESS_TOKEN';
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
  showQRCodeURL(ticket) {
    return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
  }
}
