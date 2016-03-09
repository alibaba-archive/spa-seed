'use strict'

const Router = require('toa-router')

const infoAPI = require('./api/info')
const userAPI = require('./api/user')
const indexView = require('./controller/get_index')

// 参考 https://github.com/toajs/toa-router
const router = module.exports = new Router()

// 配置静态资源路由和 views 路由
router
  .get('', indexView)
  .otherwise(function () {
    return this.render('404', {
      message: this.path + 'is not found!'
    })
  })

// 配置 API 路由
router
  .get('/api/info', infoAPI.getInfo)
  .post('/api/echo', infoAPI.echo)

router.define('/api/auth')
  .post(userAPI.getToken)
  .put(userAPI.refreshToken)
