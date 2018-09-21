import _debug from 'debug'
const debug = _debug('app:wechat:menu')
import Base from './base'

export default class Menu extends Base {
    constructor (opts = {}) {
        super (opts)
    }

    /**
     * 创建自定义菜单
     * 详细请看：http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单创建接口 * Menu:
     * ```
     * {
     *  "button":[
     *    {
     *      "type":"click",
     *      "name":"今日歌曲",
     *      "key":"V1001_TODAY_MUSIC"
     *    },
     *    {
     *      "name":"菜单",
     *      "sub_button":[
     *        {
     *          "type":"view",
     *          "name":"搜索",
     *          "url":"http://www.soso.com/"
     *        },
     *        {
     *          "type":"click",
     *          "name":"赞一下我们",
     *          "key":"V1001_GOOD"
     *        }]
     *      }]
     *    }
     *  ]
     * }
     * ```
     * Examples:
     * ```
     * var result = yield api.createMenu(menu);
     * ```
     * Result:
     * ```
     * {"errcode":0,"errmsg":"ok"}
     * ```
     * @param {Object} menu 菜单对象 */
    createMenu (menu) {
        var url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
        return this.post(url, menu);
    }

    /**
     * 获取菜单
     * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单查询接口> * Examples:
     * ```
     * var result = yield api.getMenu();
     * ```
     * Result:
     * ```
     * // 结果示例
     * {
     *  "menu": {
     *    "button":[
     *      {"type":"click","name":"今日歌曲","key":"V1001_TODAY_MUSIC","sub_button":[]},
     *      {"type":"click","name":"歌手简介","key":"V1001_TODAY_SINGER","sub_button":[]},
     *      {"name":"菜单","sub_button":[
     *        {"type":"view","name":"搜索","url":"http://www.soso.com/","sub_button":[]},
     *        {"type":"view","name":"视频","url":"http://v.qq.com/","sub_button":[]},
     *        {"type":"click","name":"赞一下我们","key":"V1001_GOOD","sub_button":[]}]
     *      }
     *    ]
     *  }
     * }
     * ```
     */
    getMenu () {
        var url = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=ACCESS_TOKEN";
        return this.get(url);
    }

    /**
     * 删除自定义菜单
     * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单删除接口>
     * Examples:
     * ```
     * var result = yield api.removeMenu();
     * ```
     * Result:
     * ```
     * {"errcode":0,"errmsg":"ok"}
     * ```
     */
    removeMenu () {
        var url = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN";
        return this.get(url);
    }

    /**
     * 获取自定义菜单配置
     * 详细请看：<http://mp.weixin.qq.com/wiki/17/4dc4b0514fdad7a5fbbd477aa9aab5ed.html>
     * Examples:
     * ```
     * var result = yield api.getMenuConfig();
     * ```
     * Result:
     * ```
     * {"errcode":0,"errmsg":"ok"}
     * ```
     */
    getMenuConfig () {
        var url = "https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=ACCESS_TOKEN";
        return this.get(url);
    }

    /**
     * 创建个性化自定义菜单
     * 详细请看：http://mp.weixin.qq.com/wiki/0/c48ccd12b69ae023159b4bfaa7c39c20.html * Menu:
     * ```
     *{
     *  "button":[
     *  {
     *      "type":"click",
     *      "name":"今日歌曲",
     *      "key":"V1001_TODAY_MUSIC"
     *  },
     *  {
     *    "name":"菜单",
     *    "sub_button":[
     *    {
     *      "type":"view",
     *      "name":"搜索",
     *      "url":"http://www.soso.com/"
     *    },
     *    {
     *      "type":"view",
     *      "name":"视频",
     *      "url":"http://v.qq.com/"
     *    },
     *    {
     *      "type":"click",
     *      "name":"赞一下我们",
     *      "key":"V1001_GOOD"
     *    }]
     * }],
     *"matchrule":{
     *  "group_id":"2",
     *  "sex":"1",
     *  "country":"中国",
     *  "province":"广东",
     *  "city":"广州",
     *  "client_platform_type":"2"
     *  }
     *}
     * ```
     * Examples:
     * ```
     * var result = yield api.addConditionalMenu(menu);
     * ```
     * Result:
     * ```
     * {"errcode":0,"errmsg":"ok"}
     * ```
     * @param {Object} menu 菜单对象 */
    addConditionalMenu (menu) {
        var url = "https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=ACCESS_TOKEN";
        return this.post (url, menu);
    }

    /**
     * 删除个性化自定义菜单
     * 详细请看：http://mp.weixin.qq.com/wiki/0/c48ccd12b69ae023159b4bfaa7c39c20.html * Menu:
     * ```
     * {
     *  "menuid":"208379533"
     * }
     * ```
     * Examples:
     * ```
     * var result = yield api.delConditionalMenu(menuid);
     * ```
     * Result:
     * ```
     * {"errcode":0,"errmsg":"ok"}
     * ```
     * @param {String} menuid 菜单id */
    delConditionalMenu (menuid) {
        var url = "https://api.weixin.qq.com/cgi-bin/menu/delconditional?access_token=ACCESS_TOKEN";
        return this.post (url, {menuid});
    }

    /**
     * 测试个性化自定义菜单
     * 详细请看：http://mp.weixin.qq.com/wiki/0/c48ccd12b69ae023159b4bfaa7c39c20.html * Menu:
     * ```
     * {
     *  "user_id":"nickma"
     * }
     * ```
     * Examples:
     * ```
     * var result = yield api.tryConditionalMenu(user_id);
     * ```
     * Result:
     * ```
     * {
     *    "button": [
     *        {
     *            "type": "view",
     *            "name": "tx",
     *            "url": "http://www.qq.com/",
     *            "sub_button": [ ]
     *        },
     *        {
     *            "type": "view",
     *            "name": "tx",
     *            "url": "http://www.qq.com/",
     *            "sub_button": [ ]
     *        },
     *        {
     *            "type": "view",
     *            "name": "tx",
     *            "url": "http://www.qq.com/",
     *            "sub_button": [ ]
     *        }
     *    ]
     * }
     * ```
     * @param {String} user_id user_id可以是粉丝的OpenID，也可以是粉丝的微信号。 */
    tryConditionalMenu (user_id) {
        var url = "https://api.weixin.qq.com/cgi-bin/menu/trymatch?access_token=ACCESS_TOKEN"
        return this.post (url, {user_id});
    }

}
