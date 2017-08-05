import _debug from 'debug'
const debug = _debug('app:server:wechat:custom_service')
import Base from './base'

const path = require('path');
const fs = require('fs');
const formstream = require('formstream');

export default class ShortUrl extends Base {
    constructor (opts = {}) {
        super (opts)
    }

    /**
     * 获取客服聊天记录
     * 详细请看：http://mp.weixin.qq.com/wiki/19/7c129ec71ddfa60923ea9334557e8b23.html
     * Opts:
     * ```
     * {
     *  "starttime" : 123456789,
     *  "endtime" : 987654321,
     *  "openid": "OPENID", // 非必须
     *  "pagesize" : 10,
     *  "pageindex" : 1,
     * }
     * ```
     * Examples:
     * ```
     * var result = await api.getRecords(opts);
     * ```
     * Result:
     * ```
     * {
     *  "recordlist": [
     *    {
     *      "worker": " test1",
     *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
     *      "opercode": 2002,
     *      "time": 1400563710,
     *      "text": " 您好，客服test1为您服务。"
     *    },
     *    {
     *      "worker": " test1",
     *      "openid": "oDF3iY9WMaswOPWjCIp_f3Bnpljk",
     *      "opercode": 2003,
     *      "time": 1400563731,
     *      "text": " 你好，有什么事情？ "
     *    },
     *  ]
     * }
     * ```
     * @param {Object} opts 查询条件
     */
    getRecords (opts) {
        var url = "https://api.weixin.qq.com/customservice/msgrecord/getrecord?access_token=ACCESS_TOKEN";
        return this.post(url, opts);
    }

    /**
     * 获取客服基本信息
     * 详细请看：http://dkf.qq.com/document-3_1.html
     * Examples:
     * ```
     * var result = await api.getCustomServiceList();
     * ```
     * Result:
     * ```
     * {
     *   "kf_list": [
     *     {
     *       "kf_account": "test1@test",
     *       "kf_nick": "ntest1",
     *       "kf_id": "1001"
     *     },
     *     {
     *       "kf_account": "test2@test",
     *       "kf_nick": "ntest2",
     *       "kf_id": "1002"
     *     },
     *     {
     *       "kf_account": "test3@test",
     *       "kf_nick": "ntest3",
     *       "kf_id": "1003"
     *     }
     *   ]
     * }
     * ```
     */
    getCustomServiceList () {
        var url = "https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token= ACCESS_TOKEN";
        return this.get(url);
    }

    /**
     * 获取在线客服接待信息
     * 详细请看：http://dkf.qq.com/document-3_2.html * Examples:
     * ```
     * var result = await api.getOnlineCustomServiceList();
     * ```
     * Result:
     * ```
     * {
     *   "kf_online_list": [
     *     {
     *       "kf_account": "test1@test",
     *       "status": 1,
     *       "kf_id": "1001",
     *       "auto_accept": 0,
     *       "accepted_case": 1
     *     },
     *     {
     *       "kf_account": "test2@test",
     *       "status": 1,
     *       "kf_id": "1002",
     *       "auto_accept": 0,
     *       "accepted_case": 2
     *     }
     *   ]
     * }
     * ```
     */
    getOnlineCustomServiceList () {
        var url = "https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token= ACCESS_TOKEN";
        return this.get(url);
    }

    /**
     * 添加客服账号
     * 详细请看：http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044813&token=&lang=zh_CN * Examples:
     * ```
     * var result = await api.addKfAccount('test@test', 'nickname', 'password');
     * ```
     * Result:
     * ```
     * {
     *  "errcode" : 0,
     *  "errmsg" : "ok",
     * }
     * ```
     * @param {String} account 账号名字，格式为：前缀@公共号名字
     * @param {String} nick 昵称
     */
    addKfAccount (account, nick) {
        var url = "https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN";
        return this.post(url, {
            kf_account: account,
            nickname: nick
        });
    }

    /**
     * 邀请绑定客服帐号
     * 详细请看：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044813&token=&lang=zh_CN
     * Examples:
     * ```
     * var result = await api.inviteworker('test@test', 'invite_wx');
     * ```
     * Result:
     * ```
     * {
     *  "errcode" : 0,
     *  "errmsg" : "ok",
     * }
     * ```
     * @param {String} account 账号名字，格式为：前缀@公共号名字
     * @param {String} wx 邀请绑定的个人微信账号
     */
    inviteworker (account, wx) {
        var url = "https://api.weixin.qq.com/customservice/kfaccount/inviteworker?access_token=ACCESS_TOKEN";
        return this.post(url, {
            kf_account: account,
            invite_wx: wx
        });
    }

    /**
     * 设置客服账号
     * 详细请看：http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044813&token=&lang=zh_CN * Examples:
     * ```
     * api.updateKfAccount('test@test', 'nickname', 'password');
     * ```
     * Result:
     * ```
     * {
     *  "errcode" : 0,
     *  "errmsg" : "ok",
     * }
     * ```
     * @param {String} account 账号名字，格式为：前缀@公共号名字
     * @param {String} nick 昵称
     */
    updateKfAccount (account, nick) {
        var url = "https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN";
        return this.post(url, {
            kf_account: account,
            nickname: nick
        });
    }
    
    /**
     * 删除客服账号
     * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html * Examples:
     * ```
     * api.deleteKfAccount('test@test');
     * ```
     * Result:
     * ```
     * {
     *  "errcode" : 0,
     *  "errmsg" : "ok",
     * }
     * ```
     * @param {String} account 账号名字，格式为：前缀@公共号名字
     */
    deleteKfAccount (account, nickname, password) {
        var url = "https://api.weixin.qq.com/customservice/kfaccount/del?access_token=ACCESS_TOKEN";
        return this.post(url, { kf_account : account, nickname, password });
    }

    /**
     * 设置客服头像
     * 详细请看：http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html * Examples:
     * ```
     * api.setKfAccountAvatar('test@test', '/path/to/avatar.png');
     * ```
     * Result:
     * ```
     * {
     *  "errcode" : 0,
     *  "errmsg" : "ok",
     * }
     * ```
     * @param {String} account 账号名字，格式为：前缀@公共号名字
     * @param {String} filepath 头像路径
     */
    async setKfAccountAvatar (account, filepath) {
        var url = "http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT".replace (/KFACCOUNT/g, account);
        var stat = await fs.stat(filepath);
        var form = formstream();
        form.file('media', filepath, path.basename(filepath), stat.size);
        var opts = {
            dataType: 'json',
            method: 'POST',
            timeout: 60000, // 60秒超时
            headers: form.headers(),
            stream: form
        };
        return await this.request(url, opts);
    }

    /**
     * 创建客服会话
     * 详细请看：http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1458044820&token=&lang=zh_CN * Examples:
     * ```
     * api.createKfSession('test@test', 'OPENID');
     * ```
     * Result:
     * ```
     * {
     *  "errcode" : 0,
     *  "errmsg" : "ok",
     * }
     * ```
     * @param {String} account 账号名字，格式为：前缀@公共号名字
     * @param {String} openid openid
     */
    createKfSession (account, openid) {
        var url = "https://api.weixin.qq.com/customservice/kfsession/create?access_token=ACCESS_TOKEN";
        return this.post(url, {
            kf_account: account,
            openid: openid
        });
    }
}