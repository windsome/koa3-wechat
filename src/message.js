/**
 * @file   middleware-apis.js
 * @author windsome.feng <86643838@163.com>
 * @date   Sat Sep 24 15:37:22 2016
 * 
 * @brief  should use access_token, we need user/authentication info.
 * 
 * 
 */
import KoaJwt from 'koa-jwt'

import _debug from 'debug'
const debug = _debug('app:server:wechat')

import convert from 'koa-convert'
var wechat = require('./wechat/wechat');

var apis = null;
var redis = null;

const redis_fn = function (fn, arg) {
    if (arguments.length > 2) arg = Array.prototype.slice.call(arguments, 1);
    //debug ("arg", arg);
    return new Promise(function (resolve, reject) {
        fn.apply (redis._redisClient, arg.concat( function (err, res) {
            //debug ("redis_fn result", err, res);
            if (err) return reject(err);
            if (arguments.length > 2) res = slice.call(arguments, 1);
            resolve(res);
        }));
    });
}

async function doEventScene2 (qrscene) {
    if (apis && redis) {
        var scene_value = await redis_fn(redis._redisClient.hget, 'qrscene',qrscene);
        //debug ("scene_value", scene_value);
        if (scene_value) {
            var obj = JSON.parse (scene_value);
            //console.log ('get qrscene', obj);
            if (apis) {
                var lockCmd = await apis._sendCmdToMqtt (apis.mqttTopicPrefix+obj.id, { cmd: 'open', id: obj.id }, 0);
            }
            var scene_value = await redis_fn(redis._redisClient.del, 'qrscene',qrscene);
            return true;
        }
    }
    return false;
}

async function processMessage(ctx) {
    // 微信输入信息都在this.weixin上
    var message = ctx.weixin;
    debug ("windsome processMessage", message);

    switch (message.MsgType) {
    case 'event': {
        var event = message.Event && message.Event.toLowerCase();
        switch (event) {
        case 'subscribe': {
            if (message.EventKey && (message.EventKey.indexOf('qrscene_') >= 0)) {
                // get qrcode, scene_id
                var qrscene = message.EventKey.substr(message.EventKey.indexOf('qrscene_'), 'qrscene_'.length);
                debug ("get scene_id:"+ qrscene);
                var ret = await doEventScene2(qrscene);
                if (ret) ctx.body = 'success'
                else ctx.body='fail';
                return;
            }
        }
        case 'scan': {
            var qrscene = message.EventKey;
            debug ("get scene_id:"+ qrscene);
            var ret = await doEventScene2(qrscene);
            //debug ("doEventScene2 ret:", ret);
            if (ret) ctx.body = 'success'
            else ctx.body='fail';
            return;
        }
        default:
            break;
        }
        break;
    }
    case 'text':
        break;
    case 'image':
        break;
    case 'voice':
        break;
    case 'video':
        break;
    case 'location':
        break;
    case 'link':
        break;
    default:
        ctx.body = 'fail';
        break;
    }
    ctx.body = 'success';
}

/*function* processMessage() {
  // 微信输入信息都在this.weixin上
  var message = this.weixin;
  console.log ("windsome processMessage", message);
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    this.body = 'hehe';
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    this.body = {
      content: 'text object',
      type: 'text'
    };
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    this.body = {
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3"
      }
    };
  } else if (message.FromUserName === 'kf') {
    // 转发到客服接口
    this.body = {
      type: "customerService",
      kfAccount: "test1@test"
    };
  } else {
    // 回复高富帅(图文回复)
    this.body = [
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ];
  }
}
*/
export default function WechatMessage (opts) {
    opts = opts || {};
    apis = opts.apis;
    redis = opts.redis;
    var router = require('koa-router')(opts.router);
    router.all('/', wechat(opts.token).middleware2(processMessage));
    //router.all('/', convert (wechat('Q0hctpus1eH5xdvrXBuTYzS23OewxhgO').middleware(processMessage)));
    return router;
}

