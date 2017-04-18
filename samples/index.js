///////////////////////////////////////////////////
// koa web server for all APPs.
///////////////////////////////////////////////////
var http = require("http");
import _debug from 'debug'
const debug = _debug('app:bin:server')

import Koa from 'koa'
const app = new Koa()
app.proxy = true;
app.use(async (ctx, next) => {
    const cookieHeader = ctx.headers.cookie;
    //ctx.originalQuery = ctx.query;
    //ctx.originalHref = ctx.request.href;
    console.log ("["+ctx.method+"] "+ctx.path+", query=", ctx.query, ", referer=", ctx.req.headers.referer, ", cookies=", cookieHeader);
    //console.log ("["+ctx.method+"] "+ctx.path+", query=", ctx.query, ", session=", ctx.session);
    await next();
})
var WechatApis = require('./server').default;
app.wechat = new WechatApis(app);
app.use(function (ctx, next) {
    var rawText = "";
    console.log ("not done! ["+ctx.req.method+"]["+ctx.path+"]["+ctx.req.url+"] ");
    //this.request.body = JSON.parse(rawText);
})



const host = 'localhost';
const port = 3000;

http.createServer(app.callback()).listen(port);

debug(`Server is now running at http://${host}:${port}.`)

