======

测试服务器

## 测试前配置
+ 登录mp.weixin.qq.com修改配置
  - 微信用户消息和事件推送处理功能（即接受URL转发的消息），开发者可在 开发->基本设置->修改配置->URL(服务器地址) 设置。注意：如果使用此测试程序，则填 `http://xxx/wcapis/v1/message`
  - 获取模板消息的id，包含（支付成功、退款通知、订单取消、中奖通知）等
  - 获取公众号相关信息填入server.js->config中，包含 origin，appId, appSecret, encodingAESKey, token
+ 登录pay.weixin.qq.com获取wechatPay相关配置
  - 普通商户登录自己帐号，服务商用户登录服务商帐号，去获取pfx证书，用p12类型的证书
  - 设置支付通知url, 如果用此测试程序则填`http://xxx/wcapis/v1/pay_notify`
  - 设置支付后的关注公众号appId
  - 服务商：appId，mchId, notifyUrl, partnerKey, subAppId, subMchId, pfx, passphrase，其中只有subAppId,subMchId是子商户的
  - 普通商户：appId, mchId, notifyUrl, partnerKey, pfx, passphrase
+ 根据之前得到的配置，修改server.js-> config的内容

## 使用koa3-wechat
```
npm install koa3-wechat --save-dev
```
具体使用参考samples目录

## 启动测试
```sh
git clone https://github.com/windsome/koa3-wechat
cd koa3-wechat
npm install 
npm run build
cd samples
npm install
npm start
```
### API
接口基本url /wcapis/v1
#### 消息测试接口
`/message`
#### 支付相关
```
/pay_notify
/get_sign_key
/get_pay_request_params
/refund
```
#### oauth2认证相关
/get_authorize_url
/get_authorize_url_website
/get_user_base
/get_session_user
#### wechat jssdk相关
/get_sign_package
#### wechat qrcode相关
/get_temp_qrcode
#### wechat user相关
/get_followers
/get_user
/batch_get_users

## 详细API
原始API文档请参见：[消息接口指南](http://mp.weixin.qq.com/wiki/index.php?title=消息接口指南)。

## 交流群

## 捐赠

## License
The MIT license.

## Contributors

