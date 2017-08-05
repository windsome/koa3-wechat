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
<img src="./219668615.jpg" width="300" alt="捐赠" align=center />

## License
The MIT license.

## Contributors

## 开发计划
1. 自定义菜单(menu.js)
  + ✔自定义菜单创建接口`Menu.createMenu(menu)`
  + ✔自定义菜单查询接口`Menu.getMenu()`
  + ✔自定义菜单删除接口`Menu.removeMenu()`
  + ✔自定义菜单事件推送`Wechat.middleware(handle)`
  + ✔个性化菜单接口
   - 创建个性化菜单`Menu.addConditionalMenu(menu)`
   - 删除个性化菜单`delConditionalMenu(menuid)`
   - 测试个性化菜单匹配结果`tryConditionalMenu(user_id)`
   - 查询个性化菜单`Menu.getMenu()`
   - 删除所有菜单`Menu.removeMenu()`
  + ✔获取自定义菜单配置接口`Menu.getMenuConfig()`
  
2. 消息管理
  + 接收消息-接收普通消息 `wechat.js`
  + 接收消息-接收事件推送 `wechat.js`
  + 发送消息-被动回复消息 `wechat.js`
  + 消息加解密说明
  + 发送消息-客服消息 `custom_service.js`
   1. 获取客服聊天记录 `getRecords (opts)`
   2. 获取客服基本信息 `getCustomServiceList ()`
   3. 获取在线客服接待信息 `getOnlineCustomServiceList ()`
   4. 添加客服账号 `addKfAccount (account, nick)`
   5. 邀请绑定客服帐号 `inviteworker (account, wx)`
   6. 设置客服账号 `updateKfAccount (account, nick)`
   7. 删除客服账号 `deleteKfAccount (account, nickname, password)`
   8. 设置客服头像 `async setKfAccountAvatar (account, filepath)`
   9. 创建客服会话 `createKfSession (account, openid)`
  + 发送消息-群发接口和原创校验
  + ✔发送消息-模板消息接口(template.js)
   - 设置所属行业`setIndustry(id1, id2)`
   - 获取设置的行业信息`getIndustry()`
   - 获得模板ID`addTemplate(templateIdShort)`
   - 获取模板列表`getAllPrivateTemplate()`
   - 删除模板`delTemplate (templateId)`
   - 发送模板消息`sendTemplate (openid, templateId, returnUrl, topColor, data)`
   - 事件推送`Wechat.middleware(handle)中模板消息`
  + 发送消息-一次性订阅消息
  + 发送消息-模板消息运营规范
  + 获取公众号的自动回
  
3. 微信网页开发（jssdk）
  + iOS网页开发适配指南
  + ✔微信网页授权
  + 微信网页开发样式库
  + 微信JS-SDK说明文档
  + 微信web开发者工具
  
4. 素材管理`media.js`,`material.js`
  + ?新增临时素材`uploadMedia (filepath, type, filename, mime)`
  + ✔获取临时素材`getMedia (mediaId, timeout = 60000)`
  + ?新增永久素材`addNews (news)`, `uploadImage (filepath)`, `addMaterial (filepath, type)`
  + ?获取永久素材`getMaterial (mediaId)`
  + ?删除永久素材`delMaterial (mediaId)`
  + ?修改永久图文素材`updateNews (news)`
  + ?获取素材总数`getMaterialCount ()`
  + ?获取素材列表`getMaterials (type, offset, count)`

5. 图文消息留言管理
  + 图文消息留言管理接口

6. 用户管理`user.js`
  + 用户标签管理-标签管理
   1. 创建标签`createTags (name)`
   2. 获取公众号已创建的标签`getTags ()`
   3. 编辑标签`updateTag (id, name)`
   4. 删除标签`deleteTag (id)`
   5. 获取标签下粉丝列表`getUsersFromTag (tagId, nextOpenId)`
  + 用户标签管理-用户管理
   1. 批量为用户打标签 `batchTagging (openIdList, tagId)`
   2. 批量为用户取消标签 `batchUnTagging (openIdList, tagId)`
   3. 获取用户身上的标签列表 `getIdList (openId)`
  + 设置用户备注名 `updateRemark (openid, remark)`
  + 获取用户基本信息(UnionID机制) `getUser (openid, lang = 'zh_CN')`
  + 获取用户列表 `getFollowers (nextOpenid)`
  + 获取用户地理位置 `wechat event:LOCATION`
  + 黑名单管理
   1. 获取公众号的黑名单列表
   2. 拉黑用户
   3. 取消拉黑用户
7. 帐号管理`qrcode.js`, `shorturl.js`
  + 生成带参数的二维码 `createTmpQRCode (sceneId, expire = 1800)`, `createLimitQRCode (sceneId)`, `showQRCodeURL (ticket)`
  + 长链接转短链接接口 `shorturl (longUrl)`
  + 微信认证事件推送
    1. 资质认证成功（此时立即获得接口权限）
    2. 资质认证失败
    3. 名称认证成功（即命名成功）
    4. 名称认证失败（这时虽然客户端不打勾，但仍有接口权限）
    5. 年审通知
    6. 认证过期失效通知

8. 数据统计
  + 用户分析数据接口
  + 图文分析数据接口
  + 消息分析数据接口
  + 接口分析数据接口
9. 微信卡券
  + 微信卡券接口说明
  + 更新日志
  + 创建卡券
  + 投放卡券
  + 核销卡券
  + 管理卡券
  + 卡券事件推送
  + 卡券-小程序打通
  + 会员卡专区
  + 朋友的券
  + 礼品卡
  + 特殊票券
  + 卡券错误码
  + 第三方代制专区
10. 微信门店
  + 微信门店接口
  + 微信门店小程序接口
11. 微信小店
  + 微信小店接口
  + 语义理解接口

12. 微信设备功能
  + 设备功能介绍
  + 如何新增产品型号

13. 新版客服功能
  + 将消息转发到客服
  + 客服管理
  + 会话控制
  + 获取聊天记录
  
14. 微信摇一摇周边
  + 申请开通摇一摇周边
  + 设备管理
  + 页面管理
  + 素材管理
  + 管理设备与页面的关联关系
  + 数据统计
  + 摇一摇关注JSAPI
  + 摇一摇事件通知
  + Html5页面获取设备信息
  + 获取设备及用户信息
  + 摇一摇红包
  + 摇一摇周边错误码

15. 微信连Wi-Fi
  + 微信连Wi-Fi开发者指引
  + Wi-Fi硬件鉴权协议接口说明
  + Wi-Fi软件服务管理接口说明
  + 开通微信连Wi-Fi插件
  + Wi-Fi门店管理
  + Wi-Fi设备管理
  + 配置连网方式
  + 商家主页管理
  + Wi-Fi数据统计
  + 连网后下发消息
  + 卡券投放
  + Wi-Fi接口返回错误码说明
  + 连网过程常见错误码
  
16. 微信扫一扫
  + 扫一扫接入指南
  + 商品创建
  + 商品发布
  + 商品管理
  + 扫一扫事件推送
  + 一物一码专区
  + 错误码
  + 在线帮助工具
  + 扫一扫常见问题
  
17. 微信发票
  + 微信电子发票
  + 微信极速开发票
  
18. 其他文档
  + 微信公众平台 · 小程序
  + 微信开放平台文档


