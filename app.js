'use strict';

var util = require('util');

var Toa = require('toa');
var config = require('config');
var toaEjs = require('toa-ejs');
var toaBody = require('toa-body');
var toaToken = require('toa-token');
var UAParser = require('ua-parser-js');

var cookieAuth = require('./modules/cookieAuth');
var router = require('./services/router');
var packageInfo = require('./package.json');

var clientParser = new UAParser();
var isDevelopment = process.env.NODE_ENV === 'development';
var publicPath = isDevelopment ? 'public/tmp' : 'public/dist';

var app = Toa(function(Thunk) {
  var path = this.path;

  // 解析客户端配置信息
  this.clientInfo = clientParser.setUA(this.get('user-agent')).getResult();

  // 非静态资源请求则解析 session cookie，读取当前用户信息
  if (path !== '/favicon.ico' && path.indexOf('/static/') !== 0)
    cookieAuth.call(this);

  // router 处理具体业务
  return router.route(this, Thunk);
});

// 设置 session cookie 密钥
app.keys = [config.sessionSecret];

// 添加必要的 config，`this.config` 可以访问
app.config = {
  version: packageInfo.version,
  sessionName: config.sessionName
};

// 错误处理
app.onerror = logErr;

// 添加 ejs render 方法: `this.render(tplName, valueObj)`
// 参考 https://github.com/toajs/toa-ejs
toaEjs(app, {
  root: publicPath + '/views',
  layout: 'layout',
  viewExt: 'html',
  cache: !isDevelopment,
  debug: isDevelopment,
  locals: { // 该对象成为 ejs 模板的全局对象
    config: { // 向前端输出的必要 config，根据需求自行调整
      name: packageInfo.name,
      version: packageInfo.version,
      apiHost: '/api',
      accountHost: config.accountHost
    },
    header: { // 向前端输出的必要 header 内容，根据需求自行调整
      title: 'SPA Seed',
      keywords: 'teambition spa seed',
      description: 'Simple page application seed for teambition'
    }
  }
});

// token 认证支持，前端 app 应该使用 token 认证，防止 Cross-domain / CORS 攻击
// 参考 https://github.com/toajs/toa-token
toaToken(app, config.tokenSecret, {
  expiresInMinutes: 24 * 60
});

// 添加请求内容解析方法：`this.parseBody()`
// 参考 https://github.com/toajs/toa-body
toaBody(app, {
  extendTypes: {
    json: ['application/x-javascript', 'application/y-javascript']
  }
});

// 启动 server
module.exports = app.listen(config.port);

// 输出启动信息
logInfo('app:', {
  host: config.host,
  listen: config.port,
  version: packageInfo.version,
  appConfig: app.config
});

function logInfo(name, obj) {
  console.log(name, util.inspect(obj, {
    colors: true
  }));
}

function logErr(err) {
  // 能被 pm2 记录
  // ignore null and response error
  if (err == null || (err.status && err.status < 500)) return;
  if (util.isError(err)) return logInfo('non-error thrown:', err);

  // catch system error
  var msg = err.stack || err.toString();
  console.error(msg.replace(/^/gm, '  '));
}
