import _debug from 'debug';
const debug = _debug('app:wechat:material');
import Base from './base';

const path = require('path');
const formstream = require('formstream');
const fs = require('fs');

export default class Material extends Base {
  constructor(opts = {}) {
    super(opts);
  }

  /**
   * 新增永久图文素材 * News:
   * ```
   * {
   *  "articles": [
   *    {
   *      "title": TITLE,
   *      "thumb_media_id": THUMB_MEDIA_ID,
   *      "author": AUTHOR,
   *      "digest": DIGEST,
   *      "show_cover_pic": SHOW_COVER_PIC(0 / 1),
   *      "content": CONTENT,
   *      "content_source_url": CONTENT_SOURCE_URL
   *    },
   *    //若新增的是多图文素材，则此处应还有几段articles结构
   *  ]
   * }
   * ```
   * Examples:
   * ```
   * api.uploadNewsMaterial(news);
   * ```
   *
   * Result:
   * ```
   * {"errcode":0,"errmsg":"ok"}
   * ```
   * @param {Object} news 图文对象
   */
  addNews(news) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=ACCESS_TOKEN';
    return this.post(url, news);
  }
  /**
   * 更新永久图文素材
   * News:
   * ```
   * {
   *  "media_id":MEDIA_ID,
   *  "index":INDEX,
   *  "articles": [
   *    {
   *      "title": TITLE,
   *      "thumb_media_id": THUMB_MEDIA_ID,
   *      "author": AUTHOR,
   *      "digest": DIGEST,
   *      "show_cover_pic": SHOW_COVER_PIC(0 / 1),
   *      "content": CONTENT,
   *      "content_source_url": CONTENT_SOURCE_URL
   *    },
   *    //若新增的是多图文素材，则此处应还有几段articles结构
   *  ]
   * }
   * ```
   * Examples:
   * ```
   * api.uploadNewsMaterial(news);
   * ```
   * Result:
   * ```
   * {"errcode":0,"errmsg":"ok"}
   * ```
   * @param {Object} news 图文对象
   */
  updateNews(news) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/material/update_news?access_token=ACCESS_TOKEN';
    return this.post(url, news);
  }
  /**
   * 根据媒体ID获取永久素材
   * 详情请见：<http://mp.weixin.qq.com/wiki/4/b3546879f07623cb30df9ca0e420a5d0.html>
   * Examples:
   * ```
   * api.getMaterial('media_id');
   * ```
   *
   * - `result`, 调用正常时得到的文件Buffer对象
   * - `res`, HTTP响应对象 * @param {String} mediaId 媒体文件的ID
   */
  getMaterial(mediaId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=ACCESS_TOKEN';
    return this.post(url, { media_id: mediaId });
  }

  /**
   * 删除永久素材
   * 详情请见：<http://mp.weixin.qq.com/wiki/5/e66f61c303db51a6c0f90f46b15af5f5.html>
   * Examples:
   * ```
   * api.removeMaterial('media_id');
   * ```
   *
   * - `result`, 调用正常时得到的文件Buffer对象
   * - `res`, HTTP响应对象 * @param {String} mediaId 媒体文件的ID
   */
  delMaterial(mediaId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/material/del_material?access_token=ACCESS_TOKEN';
    return this.post(url, { media_id: mediaId });
  }

  /**
   * 获取素材总数
   * 详情请见：<http://mp.weixin.qq.com/wiki/16/8cc64f8c189674b421bee3ed403993b8.html>
   * Examples:
   * ```
   * api.getMaterialCount();
   * ```
   *
   * - `result`, 调用正常时得到的文件Buffer对象
   * - `res`, HTTP响应对象 * Result:
   * ```
   * {
   *  "voice_count":COUNT,
   *  "video_count":COUNT,
   *  "image_count":COUNT,
   *  "news_count":COUNT
   * }
   * ```
   */
  getMaterialCount() {
    var url =
      'https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=ACCESS_TOKEN';
    return this.get(url);
  }

  /**
   * 获取永久素材列表
   * 详情请见：<http://mp.weixin.qq.com/wiki/12/2108cd7aafff7f388f41f37efa710204.html>
   * Examples:
   * ```
   * api.getMaterials(type, offset, count);
   * ```
   *
   * - `result`, 调用正常时得到的文件Buffer对象
   * - `res`, HTTP响应对象 * Result:
   * ```
   * {
   *  "total_count": TOTAL_COUNT,
   *  "item_count": ITEM_COUNT,
   *  "item": [{
   *    "media_id": MEDIA_ID,
   *    "name": NAME,
   *    "update_time": UPDATE_TIME
   *  },
   *  //可能会有多个素材
   *  ]
   * }
   * ```
   * @param {String} type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
   * @param {Number} offset 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
   * @param {Number} count 返回素材的数量，取值在1到20之间
   */
  getMaterials(type, offset, count) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=ACCESS_TOKEN';
    return this.post(url, { type: type, offset: offset, count: count });
  }
  /**
     * 上传永久素材，分别有图片（image）、语音（voice）、和缩略图（thumb）
     * 详情请见：<http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html>
     * Examples:
     * ```
     * api.uploadMaterial('filepath', type);
     * ```

     * Result:
     * ```
     * {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
     * ```
     * Shortcut: * - `exports.uploadImageMaterial(filepath);`
     * - `exports.uploadVoiceMaterial(filepath);`
     * - `exports.uploadThumbMaterial(filepath);` * @param {String} filepath 文件路径
     * @param {String} type 媒体类型，可用值有image、voice、video、thumb
     */
  async addMaterial(filepath, type) {
    var url = 'https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE'.replace(
      /TYPE/g,
      type
    );
    var stat = await fs.stat(filepath);
    var form = formstream();
    form.file('media', filepath, path.basename(filepath), stat.size);
    var opts = {
      dataType: 'json',
      method: 'POST',
      timeout: 60000, // 60秒超时
      headers: form.headers(),
      data: form
    };
    return await this.request(url, opts);
  }
}
