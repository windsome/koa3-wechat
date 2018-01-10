import getRawBody from 'raw-body';
import xml2js from 'xml2js';
import request from 'request';
import https from 'https';
import url_mod from 'url';
import md5 from './_md5sum';
import sha1 from './_sha1sum';

import _debug from 'debug'
const debug = _debug('app:server:wepay')
debug.log = console.log.bind(console);

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
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/pay/closeorder'
};

let URLS_SANDBOX = {
    GET_SIGN_KEY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey',
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
    ORDER_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
    REFUND: 'https://api.mch.weixin.qq.com/secapi/sandboxnew/pay/refund',
    REFUND_QUERY: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
    DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadbill',
    SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    CLOSE_ORDER: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder'
};

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

    async unifiedOrder (params) {
        let requiredData = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'trade_type'];
        if(params.trade_type == 'JSAPI'){
            requiredData.push('openid|sub_openid');
            requiredData.push('appid|sub_appid');
        }else if (params.trade_type == 'NATIVE'){
            requiredData.push('product_id');
        }
        params.notify_url = params.notify_url || this.notifyUrl;

        return await this.sendAndReceiveData(URLS.UNIFIED_ORDER, params, requiredData);
    }

    async orderQuery (params){
        return await this.sendAndReceiveData(URLS.ORDER_QUERY, params, ['transaction_id|out_trade_no']);
    }

    async refund (params){
        //params = this._extendWithDefault(params, ['op_user_id']);
        //params = { op_user_id: this.mchId, ...params };
        params = { op_user_id: this.subMchId, ...params };

        return await this.sendAndReceiveData(URLS.REFUND, params, ['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee'], true);
    }

    async refundQuery (params, callback){
        return await this.sendAndReceiveData(URLS.REFUND_QUERY, params, ['transaction_id|out_trade_no|out_refund_no|refund_id']);
    }

    async downloadBill (params){
        let data = await this.sendAndReceiveData(URLS.DOWNLOAD_BILL, params, ['bill_date', 'bill_type']);
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

    async shortUrl (params){
        return await this.sendAndReceiveData(URLS.SHORT_URL, params, ['long_url']);
    };

    async closeOrder (params) {
        return await this.sendAndReceiveData(URLS.CLOSE_ORDER, params, ['out_trade_no']);
    };


    async sendAndReceiveData (url, params, required = [], useCert = false) {
        let defaults = { 
            appid: this.appId,
            mch_id: this.mchId,
            nonce_str: this._generateNonceStr(),
        };
        if (this.subAppId && this.subMchId) {
            defaults = {...defaults, sub_appid: this.subAppId, sub_mch_id: this.subMchId };
        }
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

        let missing = [];
        required.forEach((key) => {
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
