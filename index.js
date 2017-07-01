var wechat = require('./wechat');
var oauth = require('./oauth');
var user = require('./user');
var jssdk = require('./jssdk');
var qrcode = require('./qrcode');
var wepay = require('./wepay');
var template = require('./template');
var media = require('./media');
var menu = require('./menu');
var message= require('./message');

module.exports = {
    wechat,
    oauth,
    user,
    jssdk,
    qrcode,
    wepay,
    template,
    media,
    menu,
    message
};
