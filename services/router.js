'use strict';

const config = require('config');
const Router = require('toa-router');
const toaStatic = require('toa-static');
const toaFavicon = require('toa-favicon');

const infoAPI = require('../api/info');
const userAPI = require('../api/user');

const indexView = require('../controllers/getIndex');

// 参考 https://github.com/toajs/toa-router
const router = module.exports = new Router();

// 配置 favicon 模块
// 参考 https://github.com/toajs/toa-favicon
const faviconModule = toaFavicon(config.publicPath + '/static/img/favicon.ico');

// 配置静态资源伺服模块
// 参考 https://github.com/toajs/toa-static
var staticModule = toaStatic({
  root: config.publicPath,
  prefix: '/static'
});

// 配置静态资源路由和 views 路由
router
  .get('', indexView)
  .get('/static/(*)', function() {
    return staticModule;
  })
  .get('/favicon.ico', function() {
    return faviconModule;
  })
  .otherwise(function() {
    return this.render('404', {
      message: this.path + 'is not found!'
    });
  });

// 配置 API 路由
router
  .get('/api/info', infoAPI.getInfo)
  .post('/api/echo', infoAPI.echo);

router.define('/api/auth')
  .post(userAPI.getToken)
  .put(userAPI.refreshToken);
