import _debug from 'debug';
const debug = _debug('app:wechat:user');
import Base from './base';

export default class User extends Base {
  constructor(opts = {}) {
    super(opts);
  }

  /**
   * 获取用户基本信息。可以设置lang，其中zh_CN 简体，zh_TW 繁体，en 英语。默认为en
   * 详情请见：<http://mp.weixin.qq.com/wiki/index.php?title=获取用户基本信息>
   * Examples:
   * ```
   * api.getUser(openid);
   * api.getUser({openid: 'openid', lang: 'en'});
   * ```
   *
   * Result:
   * ```
   * {
   *  "subscribe": 1,
   *  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
   *  "nickname": "Band",
   *  "sex": 1,
   *  "language": "zh_CN",
   *  "city": "广州",
   *  "province": "广东",
   *  "country": "中国",
   *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
   *  "subscribe_time": 1382694957
   * }
   * ```
   * @param {String|Object} options 用户的openid。或者配置选项，包含openid和lang两个属性。
   */
  getUser(openid, lang = 'zh_CN') {
    var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=LANG'
      .replace(/OPENID/g, openid)
      .replace(/LANG/g, lang);
    return this.get(url);
  }

  /**
     *  批量获取用户基本信息
     * Example:
     * ```
     * api.batchGetUser(['openid1', 'openid2'])
     * ```

     * Result:
     * ```
     * {
     *   "user_info_list": [{
     *     "subscribe": 1,
     *     "openid": "otvxTs4dckWG7imySrJd6jSi0CWE",
     *     "nickname": "iWithery",
     *     "sex": 1,
     *     "language": "zh_CN",
     *     "city": "Jieyang",
     *     "province": "Guangdong",
     *     "country": "China",
     *     "headimgurl": "http://wx.qlogo.cn/mmopen/xbIQx1GRqdvyqkMMhEaGOX802l1CyqMJNgUzKP8MeAeHFicRDSnZH7FY4XB7p8XHXIf6uJA2SCunTPicGKezDC4saKISzRj3nz/0",
     *     "subscribe_time": 1434093047,
     *     "unionid": "oR5GjjgEhCMJFyzaVZdrxZ2zRRF4",
     *     "remark": "",
     *     "groupid": 0
     *   }, {
     *     "subscribe": 0,
     *     "openid": "otvxTs_JZ6SEiP0imdhpi50fuSZg",
     *     "unionid": "oR5GjjjrbqBZbrnPwwmSxFukE41U",
     *   }]
     * }
     * ```
     * @param {Array} openids 用户的openid数组。
     */
  batchGetUsers(openids, lang = 'zh-CN') {
    var url =
      'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=ACCESS_TOKEN';
    var user_list = openids.map(openid => {
      return { openid: openid, lang: lang };
    });
    return this.post(url, { user_list });
  }

  /**
     * 获取关注者列表
     * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=获取关注者列表
     * Examples:
     * ```
     * api.getFollowers();
     * // or
     * api.getFollowers(nextOpenid);
     * ```

     * Result:
     * ```
     * {
     *  "total":2,
     *  "count":2,
     *  "data":{
     *    "openid":["","OPENID1","OPENID2"]
     *  },
     *  "next_openid":"NEXT_OPENID"
     * }
     * ```
     * @param {String} nextOpenid 调用一次之后，传递回来的nextOpenid。第一次获取时可不填
     */
  getFollowers(nextOpenid) {
    var url = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID'.replace(
      /NEXT_OPENID/g,
      nextOpenid || ''
    );
    return this.get(url);
  }

  /**
     * 设置用户备注名
     * 详细细节 http://mp.weixin.qq.com/wiki/index.php?title=设置用户备注名接口
     * Examples:
     * ```
     * api.updateRemark(openid, remark);
     * ```

     * Result:
     * ```
     * {
     *  "errcode":0,
     *  "errmsg":"ok"
     * }
     * ```
     * @param {String} openid 用户的openid
     * @param {String} remark 新的备注名，长度必须小于30字符
     */
  updateRemark(openid, remark) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token=ACCESS_TOKEN';
    return this.post(url, { openid, remark });
  }

  /**
     * 创建标签
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.createTags(name);
     * ```

     * Result:
     * ```
     * {
     *  "id":tagId,
     *  "name":tagName
     * }
     * ```
     * @param {String} name 标签名
     */
  createTags(name) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/create?access_token=ACCESS_TOKEN';
    return this.post(url, { tag: { name } });
  }

  /**
     * 获取公众号已创建的标签
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.getTags();
     * ```

     * Result:
     * ```
     *  {
     *    "tags":[{
     *        "id":1,
     *        "name":"每天一罐可乐星人",
     *        "count":0 //此标签下粉丝数
     *  },{
     *    "id":2,
     *    "name":"星标组",
     *    "count":0
     *  },{
     *    "id":127,
     *    "name":"广东",
     *    "count":5
     *  }
     *    ]
     *  }
     * ```
     */
  getTags() {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/get?access_token=ACCESS_TOKEN';
    return this.get(url);
  }

  /**
     * 编辑标签
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.updateTag(id,name);
     * ```

     * Result:
     * ```
     *  {
     *    "errcode":0,
     *    "errmsg":"ok"
     *  }
     * ```
     * @param {String} id 标签id
     * @param {String} name 标签名
     */
  updateTag(id, name) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/update?access_token=ACCESS_TOKEN';
    return this.post(url, { tag: { id, name } });
  }

  /**
     * 删除标签
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.deleteTag(id);
     * ```

     * Result:
     * ```
     *  {
     *    "errcode":0,
     *    "errmsg":"ok"
     *  }
     * ```
     * @param {String} id 标签id
     */
  deleteTag(id) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/delete?access_token=ACCESS_TOKEN';
    return this.post(url, { tag: { id } });
  }

  /**
     * 获取标签下粉丝列表
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.getUsersFromTag(tagId,nextOpenId);
     * ```

     * Result:
     * ```
     *  {
     *  "count":2,//这次获取的粉丝数量
     *  "data":{//粉丝列表
     *    "openid":[
     *       "ocYxcuAEy30bX0NXmGn4ypqx3tI0",
     *       "ocYxcuBt0mRugKZ7tGAHPnUaOW7Y"
     *     ]
     *   },
     * ```
     * @param {String} tagId 标签id
     * @param {String} nextOpenId 第一个拉取的OPENID，不填默认从头开始拉取
     */
  getUsersFromTag(tagId, nextOpenId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token=ACCESS_TOKEN';
    return this.post(url, { tagid, next_openid: nextOpenId || '' });
  }

  /**
     * 批量为用户打标签
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.batchTagging(openIdList,tagId);
     * ```

     * Result:
     * ```
     *  {
     *    "errcode":0,
     *    "errmsg":"ok"
     *  }
     * ```
     * @param {Array} openIdList openId列表
     * @param {String} tagId 标签id
     */
  batchTagging(openIdList, tagId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?access_token=ACCESS_TOKEN';
    return this.post(url, { openid_list: openIdList || [], tagid: tagId });
  }

  /**
     * 批量为用户取消标签
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.batchUnTagging(openIdList,tagId);
     * ```

     * Result:
     * ```
     *  {
     *    "errcode":0,
     *    "errmsg":"ok"
     *  }
     * ```
     * @param {Array} openIdList openId列表
     * @param {String} tagId 标签id
     */
  batchUnTagging(openIdList, tagId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/members/batchuntagging?access_token=ACCESS_TOKEN';
    return this.post(url, { openid_list: openIdList || [], tagid: tagId });
  }

  /**
     * 获取用户身上的标签列表
     * 详细细节 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140837&token=&lang=zh_CN
     * Examples:
     * ```
     * api.getIdList(openId);
     * ```

     * Result:
     * ```
     *  {
     *    "tagid_list":[//被置上的标签列表 134,2]
     *   }
     * ```
     */
  getIdList(openId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/tags/getidlist?access_token=ACCESS_TOKEN';
    return this.post(url, { openid: openId });
  }
}
