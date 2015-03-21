'use strict';
/*jshint -W124*/

const util = require('util');

const Toa = require('toa');
const config = require('config');
const toaMejs = require('toa-mejs');
const toaI18n = require('toa-i18n');
const toaBody = require('toa-body');
const toaToken = require('toa-token');
const toaCompress = require('toa-compress');
const UAParser = require('ua-parser-js');

const tools = require('./services/tools');
const router = require('./services/router');
const packageInfo = require('./package.json');
const cookieAuth = require('./modules/cookieAuth');

/**
 * 启动服务
 */
const clientParser = new UAParser();
const debugMode = process.argv.indexOf('--debug') !== -1;

const app = Toa(function*(Thunk) {
  var path = this.path;

  // 解析客户端配置信息
  this.clientInfo = clientParser.setUA(this.get('user-agent')).getResult();
  // 对于非静态资源请求，解析用户基本信息
  if (path !== '/favicon.ico' && !path.startsWith('/static/') && !path.startsWith('/404')) {
    this.user = cookieAuth(this);
    // 设置 CSP
    if (config.cspHead) {
      this.set({
        'content-security-policy': config.cspHead,
        'x-content-security-policy': config.cspHead,
        'x-webKit-csp': config.cspHead
      });
    }
  }

  yield router.route(this, Thunk);
}, function(err) {
  // API 请求错误默认处理
  if (this.path.startsWith('/api/')) return;
  console.error(err.stack);
  // 其它错误请求重定向到 404
  this.redirect('/404');
  return true;
});

app.keys = config.sessionSecret;
app.config = {
  sessionName: config.sessionName
};
app.onerror = tools.logErr;

// 添加 ejs render 方法: `this.render(tplName, valueObj)`
// 参考 https://github.com/toajs/toa-mejs
toaMejs(app, `${config.publicPath}/views/**/*.html`, {
  layout: 'layout',
  locals: {
    config: {
      apiHost: '/api',
      host: config.host,
      env: app.config.env
    },
    locale: function() {
      return this.locale;
    },
    ua: function() {
      return this.clientInfo;
    },
    __: function() {
      return this.__.apply(this, arguments);
    },
    __n: function() {
      return this.__n.apply(this, arguments);
    }
  }
});

toaI18n(app, {
  cookie: 'lang',
  locales: config.langs,
  directory: './locales'
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

if (debugMode) {
  app.use(function*() {
    var time = Date.now();
    this.on('end', function() {
      console.log(`${Date.now() - time}ms`, this.method, this.originalUrl);
    });
  });
}

app.use(toaCompress());
// 启动 server
module.exports = app.listen(config.port);

tools.logInfo('app:', {
  listen: config.port,
  appConfig: app.config
});
