import _debug from 'debug';
const debug = _debug('app:wechat:template');
import Base from './base';

export default class Template extends Base {
  constructor(opts = {}) {
    super(opts);
  }

  /**
     * 设置所属行业
     * Examples:
     * ```
     * var industryIds = {
     *  "industry_id1":'1',
     *  "industry_id2":"4"
     * };
     * api.setIndustry(industryIds);
     * ```

     * @param {Object} industryIds 公众号模板消息所属行业编号 
     */
  setIndustry(id1, id2) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=ACCESS_TOKEN';
    return this.post(url, { industry_id1: id1, industry_id2: id2 });
  }

  /**
     *
     {
     "primary_industry":{"first_class":"运输与仓储","second_class":"快递"},
     "secondary_industry":{"first_class":"IT科技","second_class":"互联网|电子商务"}
     }
    */
  getIndustry() {
    var url =
      'https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token=ACCESS_TOKEN';
    return this.get(url);
  }
  /**
   * 获得模板ID
   * Examples:
   * ```
   * var templateIdShort = 'TM00015';
   * api.addTemplate(templateIdShort);
   * ```
   * @param {String} templateIdShort 模板库中模板的编号，有“TM**”和“OPENTMTM**”等形式
   */
  addTemplate(templateIdShort) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token=ACCESS_TOKEN';
    return this.post(url, { template_id_short: templateIdShort });
  }
  /*
      {
      "template_id" : "Dyvp3-Ff0cnail_CDSzk1fIc6-9lOkxsQE7exTJbwUE"
      }
    */
  delTemplate(templateId) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/template/del_private_template?access_token=ACCESS_TOKEN';
    return this.post(url, { template_id: templateId });
  }

  /**
       {	
       "template_list": [{
       "template_id": "iPk5sOIt5X_flOVKn5GrTFpncEYTojx6ddbt8WYoV5s",
       "title": "领取奖金提醒",
       "primary_industry": "IT科技",
       "deputy_industry": "互联网|电子商务",
       "content": "{ {result.DATA} }\n\n领奖金额:{ {withdrawMoney.DATA} }\n领奖  时间:{ {withdrawTime.DATA} }\n银行信息:{ {cardInfo.DATA} }\n到账时间:  { {arrivedTime.DATA} }\n{ {remark.DATA} }",
       "example": "您已提交领奖申请\n\n领奖金额：xxxx元\n领奖时间：2013-10-10 12:22:22\n银行信息：xx银行(尾号xxxx)\n到账时间：预计xxxxxxx\n\n预计将于xxxx到达您的银行卡"
       }]
       }
    */
  getAllPrivateTemplate() {
    var url =
      'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=ACCESS_TOKEN';
    return this.get(url);
  }
  /**
   * 发送模板消息
   * Examples:
   * ```
   * var templateId: '模板id';
   * // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
   * var url: 'http://weixin.qq.com/download';
   * var topcolor = '#FF0000'; // 顶部颜色
   * var data = {
   *  user:{
   *    "value":'黄先生',
   *    "color":"#173177"
   *  }
   * };
   * api.sendTemplate('openid', templateId, url, topColor, data);
   * ```
   * @param {String} openid 用户的openid
   * @param {String} templateId 模板ID
   * @param {String} url URL置空，则在发送后，点击模板消息会进入一个空白页面（ios），或无法点击（android）
   * @param {String} topColor 顶部颜色
   * @param {Object} data 渲染模板的数据
   */
  sendTemplate(openid, templateId, returnUrl, topColor, data) {
    var url =
      'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN';
    var template = {
      touser: openid,
      template_id: templateId,
      url: returnUrl,
      topcolor: topColor,
      data: data
    };
    return this.post(url, template);
  }
}
