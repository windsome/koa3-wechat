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
  - 境内服务商版本（包含特约商户）
+ 微信公众号API支持
  - oauth.js 支持oauth2网页认证
  - jssdk.js 支持jssdk开发
  - user.js 用户管理接口
  - qrcode.js 获取永久及临时二维码
  - template.js 模板消息支持
  - media.js 多媒体接口
  - menu.js 自定义菜单
+ 具体微信公众平台功能清单详见 [公众平台api完成进度](doc/api_mp.md)
+ 具体微信支付功能清单详见 [微信支付api完成进度](doc/api_payment.md)

## Installation

```sh
$ npm install koa3-wechat
```

## Use with koa
### 公众号消息自动回复，使用wechat.js.
    详见 [wechat.js用法](doc/usage_wechat.md)


## api usage
   see <http://mp.zdili.com>
   see <http://nb.qingshansi.cn>

### 使用方法
```
  // 服务商下特约商户的参数
  let config = {
    appId: 'wxc...................', //服务商APPID，邮件中
    mchId: '14........',
    notifyUrl: 'http://<你的域名>/apis/pay_notify', // 设置到微信支付后台
    partnerKey: '1234567890abcdefghijklmnopqrstuv', // 设置成你自己的key，在pay.weixin.qq.com设置
    subAppId: 'wxf...............',
    subMchId: '14........',
    pfx: fs.readFileSync(__dirname + '/apiclient_cert_14.........p12'),
    passphrase: '14........'
  }

  // 普通商户的参数
  let config = {
    appId: 'wx7...................', //服务商APPID，邮件中
    mchId: '14........',
    notifyUrl: 'http://<你的域名>/apis/pay_notify', // 设置到微信支付后台
    partnerKey: '1234567890abcdefghijklmnopqrstuv', // 设置成你自己的key，在pay.weixin.qq.com设置
    pfx: fs.readFileSync(__dirname + '/apiclient_cert_14.........p12'),
    passphrase: '14........'
  },

  // 初始化
  let wepay = new WechatPay(config);

  // 获取订单的预支付信息
  var trade = {
    body: '描述信息', //最长127字节
    attach: '附加信息', //最长127字节
    out_trade_no: '<订单ID，一般用订单表的唯一ID或UUID>', //
    total_fee: '<订单总价>', //以分为单位，货币的最小金额
    trade_type: 'JSAPI',
    spbill_create_ip: '<发起支付的IP>', //ctx.request.ip
  };
  if (config.subMchId) {
    // 特约商户, 传入sub_openid
    trade = { ...trade, sub_openid: openid };
  } else {
    // 普通商户，传入openid
    trade = { ...trade, openid };
  }
  var params = await wepay.getBrandWCPayRequestParams(trade);
  if (!params || !(params.package && params.paySign)) {
    console.log('error! getBrandWCPayRequestParams() return null!');
  }
  // 支付成功后会有notify

  // 退款
  var retobj = await wepay.refund({ out_trade_no });

```

## Show cases
### 艺术品挖宝 <http://mp.zdili.com>
### 公众号演示，搜索 "帝利文化"

## 详细API
原始API文档请参见：[消息接口指南](http://mp.weixin.qq.com/wiki/index.php?title=消息接口指南)。

## 交流群
微信开发QQ群： 573207886

## 捐赠
<img src="./219668615.jpg" width="300" alt="捐赠" align=center />

## License
The MIT license.

## Contributors

