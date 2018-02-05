import getRawBody from 'raw-body';
import xml2js from 'xml2js';
import request from 'request';
import https from 'https';
import url_mod from 'url';
import md5 from './_md5sum';
import sha1 from './_sha1sum';
import crypto from 'crypto';

import _debug from 'debug'
const debug = _debug('app:wepay')

const signTypes = {
    MD5: md5,
    SHA1: sha1
};

let URLS_NORMAL = {
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    ORDER_QUERY: 'https://api.mch.weixin.qq.com/pay/orderquery',
    REFUND: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
    REFUND_QUERY: 'https://api.mch.weixin.qq.com/pay/refundquery',
    DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/pay/downloadbill',
    SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/pay/closeorder',
    REDPACK_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack',
    REDPACK_GROUP_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack',
    REDPACK_QUERY: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo',
    TRANSFERS: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
    GET_TRANSFER_INFO: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo',
    PAY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank',
    QUERY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/query_bank',
  };

let URLS_SANDBOX = {
    GET_SIGN_KEY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey',
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
    ORDER_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
    REFUND: 'https://api.mch.weixin.qq.com/secapi/sandboxnew/pay/refund',
    REFUND_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
    DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadbill',
    SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder',
    REDPACK_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack',
    REDPACK_GROUP_SEND: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack',
    REDPACK_QUERY: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo',
    TRANSFERS: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
    GET_TRANSFER_INFO: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo',
    PAY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank',
    QUERY_BANK: 'https://api.mch.weixin.qq.com/mmpaysptrans/query_bank',
  };

let PAY_BANK_GETPUBLICKEY = 'https://fraud.mch.weixin.qq.com/risk/getpublickey';

//let URLS = URLS_SANDBOX;
let URLS = URLS_NORMAL;

export default class Wepay {
    constructor (config = {}) {
        this.appId = config.appId;
        this.subAppId = config.subAppId;
        this.partnerKey = config.partnerKey;
        this.orignPartnerKey = config.partnerKey;
        this.mchId = config.mchId;
        this.subMchId = config.subMchId;
        this.notifyUrl = config.notifyUrl;
        this.passphrase = config.passphrase || config.mchId;
        this.pfx = config.pfx;
    }

    /**
     * 微信内H5调起支付
     * 见： <https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6>
     * 在微信浏览器里面打开H5网页中执行JS调起支付。接口输入输出数据格式为JSON。
     * 注意：WeixinJSBridge内置对象在其他浏览器中无效。
     * @param {*} order 订单信息
     */
    async getBrandWCPayRequestParams (order) {
        let self = this;
        let default_params = {
            appId: this.appId,
            timeStamp: this._generateTimeStamp(),
            nonceStr: this._generateNonceStr(),
            signType: 'MD5',
        };
        
        order = { notify_url: this.notifyUrl, ...order };

        let retobj = await this.unifiedOrder(order)
        
        let params  = {...default_params, package: 'prepay_id=' + retobj.prepay_id }
        //if (order.total_fee) params.total_fee = order.total_fee+"";
        params.paySign = this._getSign (params);
        if(order.trade_type == 'NATIVE'){
            params.code_url = retobj.code_url;
        }
        params.timestamp = params.timeStamp;
        return params;
    }

    /**
     * Generate parameters for `WeixinJSBridge.invoke('editAddress', parameters)`.
     *
     * @param  {String}   data.url  Referer URL that call the API. *Note*: Must contain `code` and `state` in querystring.
     * @param  {String}   data.accessToken
     * @param  {Function} callback(err, params)
     *
     * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_9
     */
    getEditAddressParams (data) {
        if (!(data && data.url && data.accessToken)) {
            throw new Error('Missing url or accessToken, url='+(data && data.url)+', accessToken='+(data && data.accessToken));
        }

        let params = {
            appId: this.appId,
            scope: 'jsapi_address',
            signType: 'SHA1',
            timeStamp: this._generateTimeStamp(),
            nonceStr: this._generateNonceStr(),
        };
        let signParams = {
            appid: params.appId,
            url: data.url,
            timestamp: params.timeStamp,
            noncestr: params.nonceStr,
            accesstoken: data.accessToken,
        };
        let string = this._toQueryString(signParams);
        params.addrSign = signTypes[params.signType](string);
        return params;
    }

    /**
     * 获取sandbox测试key
     */
    async getSignKey () {
        if (!URLS.GET_SIGN_KEY) {
            throw new Error ("not in sandbox mode!");
        }
        let params = {
            mch_id: this.mchId,
            nonce_str: this._generateNonceStr(),
        };
        this.partnerKey = this.orignPartnerKey;
        let retobj = await this.sendAndReceiveData(URLS.GET_SIGN_KEY, params);
        if (retobj.sandbox_signkey) {
            debug ("set partnerKey from ", this.partnerKey, " to ", retobj.sandbox_signkey);
            this.partnerKey = retobj.sandbox_signkey;
        }
        return retobj;
    }

    /**
     * 统一下单接口
     * 见：<https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1>
     * 除被扫支付场景以外，商户系统先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易回话标识后再按扫码、JSAPI、APP等不同场景生成交易串调起支付。
     * @param {*} params 订单信息
     */
    async unifiedOrder (params) {
        let requiredData = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'trade_type'];
        if(params.trade_type == 'JSAPI'){
            requiredData.push('openid|sub_openid');
            requiredData.push('appid|sub_appid');
        }else if (params.trade_type == 'NATIVE'){
            requiredData.push('product_id');
        }
        params.notify_url = params.notify_url || this.notifyUrl;

        return await this.sendAndReceiveData(URLS.UNIFIED_ORDER, params, { required: requiredData});
    }

    /**
     * 订单查询
     * @param {*} params 订单信息
     * transaction_id （微信订单号）或 out_trade_no （用户订单号）
     */
    async orderQuery (params){
        return await this.sendAndReceiveData(URLS.ORDER_QUERY, params, { required: ['transaction_id|out_trade_no']});
    }

    /**
     * 退款
     * @param {*} params 退款单信息
     * 必填信息：['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee']
     */
    async refund (params){
        //params = this._extendWithDefault(params, ['op_user_id']);
        //params = { op_user_id: this.mchId, ...params };
        params = { op_user_id: this.subMchId, ...params };

        return await this.sendAndReceiveData(URLS.REFUND, params, { required: ['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee'], useCert: true });
    }

    /**
     * 退款查询
     * @param {*} params 
     * 必填信息：['transaction_id|out_trade_no|out_refund_no|refund_id']
     */
    async refundQuery (params){
        return await this.sendAndReceiveData(URLS.REFUND_QUERY, params, { required: ['transaction_id|out_trade_no|out_refund_no|refund_id'] });
    }

    /**
     * 下载订单流水
     * @param {*} params 退款查询字段
     * 必填信息：['bill_date', 'bill_type']
     */
    async downloadBill (params){
        let data = await this.sendAndReceiveData(URLS.DOWNLOAD_BILL, params, { required: ['bill_date', 'bill_type'] });
        if (data.type === 'text') {
            // parse xml fail, parse csv.
            let rows = data.xml.trim().split(/\r?\n/);

            const toArr = (rows) => {
                let titles = rows[0].split(',');
                let bodys = rows.splice(1);
                let data = [];

                bodys.forEach((row) => {
                    let rowData = {};
                    row.split(',').forEach((cell,i) => {
                        rowData[titles[i]] = cell.split('`')[1];
                    });
                    data.push(rowData);
                });
                return data;
            }

            return {
                list: toArr(rows.slice(0, rows.length - 2)),
                stat: toArr(rows.slice(rows.length - 2, rows.length))[0]
            };
        } else {
            return null;
        }
    };

    /**
     * 长连接转短链接
     * @param {*} params 
     * 必填信息：['long_url']
     */
    async shortUrl (params){
        return await this.sendAndReceiveData(URLS.SHORT_URL, params, { required: ['long_url'] });
    };

    /**
     * 关闭订单
     * @param {*} params 
     * 必填信息：['out_trade_no']
     */
    async closeOrder (params) {
        return await this.sendAndReceiveData(URLS.CLOSE_ORDER, params, { required: ['out_trade_no'] });
    };

    /**
     * 发放普通红包
     * TODO: 注意里面没有appid, 但存在wxappid,
     * @param {*} params 
     */
    async sendRedPacket(params) {
        let requiredData = ['wxappid', 'mch_billno', 'send_name', 're_openid', 'total_amount', 'total_num', 'wishing', 'client_ip', 'act_name', 'remark'];
        return await this.sendAndReceiveData(URLS.REDPACK_SEND, {...params, wxappid: this.appId }, { required: requiredData, useCert: true, removed: ['appid'] });
    };
    /**
     * 发放裂变红包
     * 裂变红包：一次可以发放一组红包。首先领取的用户为种子用户，种子用户领取一组红包当中的一个，并可以通过社交分享将剩下的红包给其他用户。裂变红包充分利用了人际传播的优势。 
     * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=13_5&index=4>
     * @param {*} params 
     */
    async sendRedPacketGroup(params) {
        let requiredData = ['wxappid', 'mch_billno', 'send_name', 're_openid', 'total_amount', 'total_num', 'amt_type', 'wishing', 'act_name', 'remark'];
        return await this.sendAndReceiveData(URLS.REDPACK_GROUP_SEND, {...params, wxappid: this.appId }, { required: requiredData, useCert: true, removed: ['appid'] });
    };
    /**
     * 查询红包记录
     * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=13_6&index=5>
     * @param {*} params 
     */
    async redPacketQuery (params) {
        let requiredData = ['mch_billno'];
        return await this.sendAndReceiveData(URLS.REDPACK_QUERY, {...params, bill_type: 'MCHT'}, { required: requiredData, useCert: true });
    };
  
    ////////////////////////////////////////////////////////////
    // 企业付款
    ////////////////////////////////////////////////////////////
    /**
     * 企业付款到用户微信零钱
     * 企业付款业务是基于微信支付商户平台的资金管理能力，为了协助商户方便地实现企业向个人付款，针对部分有开发能力的商户，提供通过API完成企业付款的功能。 
     * 比如目前的保险行业向客户退保、给付、理赔。
     * 企业付款将使用商户的可用余额，需确保可用余额充足。查看可用余额、充值、提现请登录商户平台“资金管理”进行操作。
     * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2>
     * @param {*} params 支付参数
     * 必选参数: ['partner_trade_no', 'openid', 'check_name', 'amount', 'desc', 'spbill_create_ip']
     */
    async transfers (params) {
        let requiredData = ['partner_trade_no', 'openid', 'check_name', 'amount', 'desc', 'spbill_create_ip'];
        return await this.sendAndReceiveData(URLS.TRANSFERS, params, { required: requiredData, useCert: true });
    };
    /**
     * 查询企业付款
     * 用于商户的企业付款操作进行结果查询，返回付款操作详细结果。
     * 查询企业付款API只支持查询30天内的订单，30天之前的订单请登录商户平台查询。
     * @param {*} params 
     * 必选参数: ['partner_trade_no']
     */
    async getTransferInfo (params) {
        let requiredData = ['partner_trade_no'];
        return await this.sendAndReceiveData(URLS.GET_TRANSFER_INFO, params, { required: requiredData, useCert: true });
    };
  
    /**
     * 企业付款到银行卡
     * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=24_2>
     * @param {*} params 支付参数
     * 必选参数: ['partner_trade_no', 'enc_bank_no', 'enc_true_name', 'bank_code', 'amount']
     */
    async payBank (params) {
        let {bank_no, true_name, ...rest} = params || {};
        if (!bank_no || !true_name) {
            throw new Error ('missing required bank_no or true_name!');
        }
        let publicKey = await this.payBank_getPublicKey();

        let enc_bank_no = crypto.publicEncrypt(publicKey, new Buffer(bank_no)).toString("base64");
        let enc_true_name = crypto.publicEncrypt(publicKey, new Buffer(true_name)).toString("base64");

        let newParams = {...rest, enc_bank_no, enc_true_name};
        let requiredData = ['partner_trade_no', 'enc_bank_no', 'enc_true_name', 'bank_code', 'amount'];
        return await this.sendAndReceiveData(URLS.PAY_BANK, newParams, { required: requiredData, useCert: true });
    };
    /**
     * 获取RSA公钥API
     * 用来加密银行卡号，姓名等信息，payBank中会用。
     * 将密文传给微信侧相应字段，如付款接口（enc_bank_no/enc_true_name）
     * 接口默认输出PKCS#1格式的公钥，商户需根据自己开发的语言选择公钥格式 
     */
    async payBank_getPublicKey () {
        if (!this._bankPublicKey) {
            let result = await this.sendAndReceiveData(PAY_BANK_GETPUBLICKEY, null, null, true);
            console.log ("get public key result:", result);
            if (result.return_code == 'SUCCESS' && result.result_code == 'SUCCESS') {
                this._bankPublicKey = result.pub_key;
            }
        }
        return this._bankPublicKey;
    };
    /**
     * 查询企业付款银行卡API
     * 用于对商户企业付款到银行卡操作进行结果查询，返回付款操作详细结果。
     * 见: <https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=24_3>
     * @param {*} params 
     * 必选参数: ['partner_trade_no']
     */
    async queryBank (params) {
        let requiredData = ['partner_trade_no'];
        return await this.sendAndReceiveData(URLS.QUERY_BANK, params, { required: requiredData, useCert: true });
    };

    ////////////////////////////////////////////////////////////
    // send and receive data:
    ////////////////////////////////////////////////////////////
    async sendAndReceiveData (url, params, options) {
        let { required = [], useCert = false, removed = [] } = options || {};
        let defaults = { 
            appid: this.appId,
            mch_id: this.mchId,
            nonce_str: this._generateNonceStr(),
        };
        if (this.subAppId && this.subMchId) {
            defaults = {...defaults, sub_appid: this.subAppId, sub_mch_id: this.subMchId };
        }
        params = params || {};
        params = { ...defaults, ...params };
        params.sign = this._getSign (params); 

        if(params.long_url){
            params.long_url = encodeURIComponent(params.long_url);
        }
        
        for(let key in params){
            if(params[key] !== undefined && params[key] !== null){
                params[key] = params[key].toString();
            }
        }

        removed && removed.forEach( key => {
            if (params.hasOwnProperty(key)) {
                delete params[key];
            }
        })

        let missing = [];
        required && required.forEach((key) => {
            let alters = key.split('|');
            for (let i = alters.length - 1; i >= 0; i--) {
                if (params[alters[i]]) {
                    return;
                }
            }
            missing.push(key);
        });
        
        if(missing.length){
            debug ('error! missing params ' + missing.join(','));
            throw new Error ('missing params ' + missing.join(','));
        }

        let requestFn = (useCert ? this._requestWithCert : this._request).bind(this);
        debug ("request:", params);
        let xml = null;
        let data = null;
        try {
            xml = await requestFn (url, this._buildXml(params));
            data = await this._parseXml (xml);
        } catch (error) {
            debug ("parse xml fail! error=", error);
            return { type:'text', xml };
        }
        debug ("response: parsed=", data, ", orginXml=", xml);
        if (data.return_code == 'SUCCESS' && data.result_code == 'SUCCESS') {
            debug ("pay success!");
        } else {
            debug ("error! pay fail!");
            let errmsg = data.err_code_des || data.err_code || data.result_code || data.return_msg;
            throw new Error ('pay fail! ' + errmsg);
        }
        return data;
    }

    async notifyParse (xml) {
        return await this._parseXml (xml);
    }

    notifyResult (params) {
        return this._buildXml(params);
    }

    ////////////////////////////////////////////////////////////
    // util functions:
    ////////////////////////////////////////////////////////////
    _request (url, data) {
        return new Promise( (resolve, reject) => {
            request({
                url: url,
                method: 'POST',
                body: data
            }, function (err, response, body) {
                if (err) reject (err);
                else resolve (body);
            });
        })
    }
    
    _requestWithCert (url, data) {
        return new Promise ( (resolve, reject) => {
            let parsed_url = url_mod.parse(url);
            let opts = {
                host: parsed_url.host,
                port: 443,
                path: parsed_url.path,
                pfx: this.pfx,
                passphrase: this.passphrase,
                method: 'POST'
            };
            debug ("_requestWithCert:", opts);
            let req = https.request(opts, (res) => {
                let content = '';
                res.on('data', function(chunk) {
                    content += chunk;
                });
                res.on('end', function(){
                    resolve(content);
                });
            });
            
            req.on('error', function(e) {
                reject(e);
            });
            req.write(data);
            req.end();
        })
    }
    
    _buildXml (obj) {
        let builder = new xml2js.Builder({
            allowSurrogateChars: true
        });
        let xml = builder.buildObject({
            xml:obj
        });
        //console.dir (xml);
        return xml;
    }

    _parseXml (xml) {
        return new Promise ( (resolve, reject) => {
            let parser = new xml2js.Parser({
                trim: true,
                explicitArray: false
            });
            parser.parseString(xml, (err, result) => {
                //console.dir(result);
                if (err) reject (err);
                else resolve (result.xml);
            });
        });
    }

    _getSign (pkg, signType) {
        let { sign, ...pkg2 } = pkg;
        signType = signType || 'MD5';
        let string1 = this._toQueryString(pkg2);
        let stringSignTemp = string1 + '&key=' + this.partnerKey;
        let signValue = signTypes[signType](stringSignTemp).toUpperCase();
        return signValue;
    }

    _toQueryString (object) {
        return Object.keys(object).filter(function (key) {
            return object[key] !== undefined && object[key] !== '';
        }).sort().map(function (key) {
            return key + '=' + object[key];
        }).join('&');
    }
    
    _generateTimeStamp () {
        return ""+Math.floor(new Date() / 1000);
    }

    /**
     * [_generateNonceStr description]
     * @param  {[type]} length [description]
     * @return {[type]}        [description]
     */
    _generateNonceStr (length) {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let maxPos = chars.length;
        let noceStr = '';
        for (let i = 0; i < (length || 32); i++) {
            noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return noceStr;
    }
}
