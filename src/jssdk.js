import _debug from 'debug'
const debug = _debug('app:wechat:jssdk')
import Base from './base'
import crypto from 'crypto'

export default class Jssdk extends Base {
    constructor (opts = {}) {
        super (opts)
        this.apiTickets = {
        };
    }

    async getSignPackage (url) {
        var jsApiTicket = await this._getJsApiTicket();
        debug ("jsApiTicket", jsApiTicket);
        var currentTimestamp = parseInt(new Date().getTime() / 1000) + '';

        var raw = (args) => {
            var keys = Object.keys(args);
            keys = keys.sort()
            var newArgs = {}; 
            keys.forEach(function (key) {
                newArgs[key.toLowerCase()] = args[key];
            }); 
            
            var string = ''; 
            for (var k in newArgs) {
                string += '&' + k + '=' + newArgs[k];
            }
            string = string.substr(1);
            return string;
        };

        var createNonceStr =() => {
            return Math.random().toString(36).substr(2, 15);
        }

        
        var ret = { 
            jsapi_ticket: jsApiTicket,
            nonceStr: createNonceStr(),
            timestamp: currentTimestamp,
            url: url 
        };
        
        var string = raw(ret);

        var shasum = crypto.createHash('sha1');
        shasum.update(string);
        ret.signature = shasum.digest('hex');
        // var jsSHA = require('jssha');
        // var shaObj = new jsSHA(string, 'TEXT');
        // ret.signature = shaObj.getHash('SHA-1', 'HEX');
        
        ret.appId = this.appId;
        return ret;
    }

    async _getJsApiTicket() {
        var cachedTicket = this.apiTickets[this.appId];
        var currentTimestamp = parseInt(new Date().getTime() / 1000);
        var expireTime = (cachedTicket && cachedTicket.expire_time) || 0;
        if (expireTime < currentTimestamp) {
            // ticket has expire.
            debug ("ticket has expired, need refresh!");
            var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=1&access_token=ACCESS_TOKEN";
            var resJson = await this.get(url);
            if (resJson && resJson.ticket) {
                var newTicket = {};
                newTicket.expire_time = currentTimestamp + 7200;
                newTicket.ticket = resJson.ticket;
                this.apiTickets[this.appId] = newTicket;
                cachedTicket = newTicket;
            } else {
                debug ("error! _getJsApiTicket: request fail! url="+url);
            }
        }
        return cachedTicket.ticket;
    }

}
