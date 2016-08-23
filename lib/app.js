'use strict'

const Toa = require('toa')
const ilog = require('ilog')
const config = require('config')
const toaMejs = require('toa-mejs')
const toaI18n = require('toa-i18n')
const toaBody = require('toa-body')
const toaToken = require('toa-token')
const toaStatic = require('toa-static')
const toaFavicon = require('toa-favicon')
const toaCompress = require('toa-compress')
const toaCookieSession = require('toa-cookie-session')
const UAParser = require('ua-parser-js')
const proxyaddr = require('proxy-addr')

const routers = require('./router')
const morgan = require('./service/morgan')
const limiter = require('./service/limiter')

ilog.level = config.logLevel

/**
 * 启动服务
 */
const app = module.exports = Toa()

app.keys = config.sessionSecret
app.config = {
  sessionName: config.sessionName
}
app.onerror = function (err) {
  if (err && err.status < 500) return
  ilog.error(err)
}

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
    locale: function () {
      return this.locale
    },
    ua: function () {
      return this.state.clientInfo
    },
    __: function () {
      return this.__.apply(this, arguments)
    },
    __n: function () {
      return this.__n.apply(this, arguments)
    }
  }
})

toaI18n(app, {
  cookie: 'lang',
  locales: config.langs,
  directory: './locales'
})

// token 认证支持，前端 app 应该使用 token 认证，防止 Cross-domain / CORS 攻击
// 参考 https://github.com/toajs/toa-token
toaToken(app, config.tokenSecret, {
  expiresInMinutes: 24 * 60
})

// 添加请求内容解析方法：`this.parseBody()`
// 参考 https://github.com/toajs/toa-body
toaBody(app)
app.use(toaFavicon('favicon.ico'))
app.use(toaStatic({
  root: config.publicPath,
  prefix: '/static',
  prunePrefix: false,
  maxCacheLength: app.config.env === 'development' ? -1 : 0
}))

app.use(morgan(app.config.env === 'production' ? 'production' : 'tiny'))
app.use(toaCookieSession({name: config.sessionName}))

const clientParser = new UAParser()
app.use(function * () {
  this.state.ip = this.get('x-real-ip') || proxyaddr(this.req, 'uniquelocal')
  // 解析客户端配置信息
  this.state.clientInfo = clientParser.setUA(this.get('user-agent')).getResult()

  this.state.user = this.session.user || {}
  this.state.uid = this.state.user._id
  if (!this.state.uid) {
    try {
      this.state.uid = this.token._id
    } catch (e) {}
  }
})
app.use(limiter)
app.use(toaCompress())
app.use(routers.apiRouter.toThunk())
app.use(routers.router.toThunk())
// 启动 server
app.listen(config.port, () => ilog.info({listen: config.port, message: 'App started'}))
