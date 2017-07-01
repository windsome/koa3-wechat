koa3-wechat [![NPM version](https://badge.fury.io/js/koa3-wechat.png)](http://badge.fury.io/js/koa3-wechat) [![Build Status](https://travis-ci.org/windsome/koa3-wechat.png?branch=master)](https://travis-ci.org/windsome/koa3-wechat) [![Dependencies Status](https://david-dm.org/windsome/koa3-wechat.png)](https://david-dm.org/windsome/koa3-wechat) [![Coverage Status](https://coveralls.io/repos/windsome/koa3-wechat/badge.png)](https://coveralls.io/r/windsome/koa3-wechat)
======

微信公众平台消息接口服务中间件与API SDK

## 功能列表
+ 微信用户消息和事件推送处理功能（即接受URL转发的消息），开发者可在 开发->基本设置->修改配置->URL(服务器地址) 设置。
  - 对应于wechat.js
  - 自动回复（文本、图片、语音、视频、音乐、图文）
  - 会话支持（创新功能）
+ 微信支付API支持
  - 对应wepay.js
  - 普通商户
  - 服务商商户及特约商户
+ 微信公众号API支持
  - oauth.js 支持oauth2网页认证
  - jssdk.js 支持jssdk开发
  - user.js 用户管理接口
  - qrcode.js 获取永久及临时二维码
  - template.js 模板消息支持
  - media.js 多媒体接口
  - menu.js 自定义菜单

## Installation

```sh
$ npm install koa3-wechat
```

## Use with koa

```js
var wechat = require('koa3-wechat');

app.use(wechat('some token').middleware(async function (ctx, next) {
  // 微信输入信息都在ctx.weixin上
  var message = ctx.weixin;
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    ctx.body = 'hehe';
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    ctx.body = {
      content: 'text object',
      type: 'text'
    };
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    ctx.body = {
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
    ctx.body = {
      type: "customerService",
      kfAccount: "test1@test"
    };
  } else {
    // 回复高富帅(图文回复)
    ctx.body = [
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ];
  }
}));
```
备注：token在微信平台的开发者中心申请

### 回复消息
当用户发送消息到微信公众账号，自动回复一条消息。这条消息可以是文本、图片、语音、视频、音乐、图文。详见：[官方文档](http://mp.weixin.qq.com/wiki/index.php?title=发送被动响应消息)

#### 回复文本
```js
ctx.body = 'Hello world!';
// 或者
ctx.body = {type: "text", content: 'Hello world!'};
```
#### 回复图片
```js
ctx.body = {
  type: "image",
  content: {
    mediaId: 'mediaId'
  }
};
```
#### 回复语音
```js
ctx.body = {
  type: "voice",
  content: {
    mediaId: 'mediaId'
  }
};
```
#### 回复视频
```js
ctx.body = {
  type: "video",
  content: {
    mediaId: 'mediaId',
    thumbMediaId: 'thumbMediaId'
  }
};
```
#### 回复音乐
```js
ctx.body = {
  title: "来段音乐吧",
  description: "一无所有",
  musicUrl: "http://mp3.com/xx.mp3",
  hqMusicUrl: "http://mp3.com/xx.mp3"
};
```
#### 回复图文
```js
ctx.body = [
  {
    title: '你来我家接我吧',
    description: '这是女神与高富帅之间的对话',
    picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
    url: 'http://nodeapi.cloudfoundry.com/'
  }
];
```

#### 回复空串
```js
ctx.body = '';
```

#### 转发到客服接口
```js
ctx.body = {
  type: "customerService",
  kfAccount: "test1@test" //可选
};
```

## api usage
   see http://mp.zdili.com

## Show cases
### 艺术品挖宝 <http://mp.zdili.com>
### 公众号演示，搜索 "帝利文化"

## 详细API
原始API文档请参见：[消息接口指南](http://mp.weixin.qq.com/wiki/index.php?title=消息接口指南)。

## 交流群
微信开发QQ群： 573207886

## 捐赠
![捐赠](219668615.jpg)

## License
The MIT license.

## Contributors

