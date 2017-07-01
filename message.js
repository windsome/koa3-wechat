'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var doEventScene2 = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(qrscene) {
        var scene_value, obj, lockCmd;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(apis && redis)) {
                            _context.next = 14;
                            break;
                        }

                        _context.next = 3;
                        return redis_fn(redis._redisClient.hget, 'qrscene', qrscene);

                    case 3:
                        scene_value = _context.sent;

                        if (!scene_value) {
                            _context.next = 14;
                            break;
                        }

                        obj = JSON.parse(scene_value);
                        //console.log ('get qrscene', obj);

                        if (!apis) {
                            _context.next = 10;
                            break;
                        }

                        _context.next = 9;
                        return apis._sendCmdToMqtt(apis.mqttTopicPrefix + obj.id, { cmd: 'open', id: obj.id }, 0);

                    case 9:
                        lockCmd = _context.sent;

                    case 10:
                        _context.next = 12;
                        return redis_fn(redis._redisClient.del, 'qrscene', qrscene);

                    case 12:
                        scene_value = _context.sent;
                        return _context.abrupt('return', true);

                    case 14:
                        return _context.abrupt('return', false);

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function doEventScene2(_x) {
        return _ref.apply(this, arguments);
    };
}();

var processMessage = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
        var message, event, qrscene, ret;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // 微信输入信息都在this.weixin上
                        message = ctx.weixin;

                        debug("windsome processMessage", message);

                        _context2.t0 = message.MsgType;
                        _context2.next = _context2.t0 === 'event' ? 5 : _context2.t0 === 'text' ? 26 : _context2.t0 === 'image' ? 27 : _context2.t0 === 'voice' ? 28 : _context2.t0 === 'video' ? 29 : _context2.t0 === 'location' ? 30 : _context2.t0 === 'link' ? 31 : 32;
                        break;

                    case 5:
                        event = message.Event && message.Event.toLowerCase();
                        _context2.t1 = event;
                        _context2.next = _context2.t1 === 'subscribe' ? 9 : _context2.t1 === 'scan' ? 17 : 24;
                        break;

                    case 9:
                        if (!(message.EventKey && message.EventKey.indexOf('qrscene_') >= 0)) {
                            _context2.next = 17;
                            break;
                        }

                        // get qrcode, scene_id
                        qrscene = message.EventKey.substr(message.EventKey.indexOf('qrscene_'), 'qrscene_'.length);

                        debug("get scene_id:" + qrscene);
                        _context2.next = 14;
                        return doEventScene2(qrscene);

                    case 14:
                        ret = _context2.sent;

                        if (ret) ctx.body = 'success';else ctx.body = 'fail';
                        return _context2.abrupt('return');

                    case 17:
                        qrscene = message.EventKey;

                        debug("get scene_id:" + qrscene);
                        _context2.next = 21;
                        return doEventScene2(qrscene);

                    case 21:
                        ret = _context2.sent;

                        //debug ("doEventScene2 ret:", ret);
                        if (ret) ctx.body = 'success';else ctx.body = 'fail';
                        return _context2.abrupt('return');

                    case 24:
                        return _context2.abrupt('break', 25);

                    case 25:
                        return _context2.abrupt('break', 34);

                    case 26:
                        return _context2.abrupt('break', 34);

                    case 27:
                        return _context2.abrupt('break', 34);

                    case 28:
                        return _context2.abrupt('break', 34);

                    case 29:
                        return _context2.abrupt('break', 34);

                    case 30:
                        return _context2.abrupt('break', 34);

                    case 31:
                        return _context2.abrupt('break', 34);

                    case 32:
                        ctx.body = 'fail';
                        return _context2.abrupt('break', 34);

                    case 34:
                        ctx.body = 'success';

                    case 35:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function processMessage(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

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


exports.default = WechatMessage;

var _koaJwt = require('koa-jwt');

var _koaJwt2 = _interopRequireDefault(_koaJwt);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file   middleware-apis.js
 * @author windsome.feng <86643838@163.com>
 * @date   Sat Sep 24 15:37:22 2016
 * 
 * @brief  should use access_token, we need user/authentication info.
 * 
 * 
 */
var debug = (0, _debug3.default)('app:server:wechat');

var wechat = require('./wechat/wechat');

var apis = null;
var redis = null;

var redis_fn = function redis_fn(fn, arg) {
    if (arguments.length > 2) arg = Array.prototype.slice.call(arguments, 1);
    //debug ("arg", arg);
    return new _promise2.default(function (resolve, reject) {
        fn.apply(redis._redisClient, arg.concat(function (err, res) {
            //debug ("redis_fn result", err, res);
            if (err) return reject(err);
            if (arguments.length > 2) res = slice.call(arguments, 1);
            resolve(res);
        }));
    });
};

function WechatMessage(opts) {
    opts = opts || {};
    apis = opts.apis;
    redis = opts.redis;
    var router = require('koa-router')(opts.router);
    router.all('/', wechat(opts.token).middleware2(processMessage));
    //router.all('/', convert (wechat('Q0hctpus1eH5xdvrXBuTYzS23OewxhgO').middleware(processMessage)));
    return router;
}