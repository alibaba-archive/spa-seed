'use strict';

var Router = require('toa-router');
var toaStatic = require('toa-static');
var toaFavicon = require('toa-favicon');

var infoAPI = require('../api/info');
var userAPI = require('../api/user');

var indexView = require('../controllers/getIndex');

// 参考 https://github.com/toajs/toa-router
var router = module.exports = new Router();
var isDevelopment = process.env.NODE_ENV === 'development';
var publicPath = isDevelopment ? 'public/tmp' : 'public/dist';

// 配置 favicon 模块
// 参考 https://github.com/toajs/toa-favicon
var faviconModule = toaFavicon(publicPath + '/img/favicon.ico');

// 配置静态资源伺服模块
// 参考 https://github.com/toajs/toa-static
var staticModule = toaStatic({
  root: publicPath,
  prefix: '/static',
  prunePrefix: true
});

// 配置静态资源路由和 views 路由
router
  .get('', indexView)
  .get('/static/(*)', function(Thunk) {
    return staticModule;
  })
  .get('/favicon.ico', function(Thunk) {
    return faviconModule;
  })
  .otherwise(function(Thunk) {
    return this.render('404', {
      message: this.path + 'is not found!'
    });
  });

// 配置 API 路由
router.get('/api/info', infoAPI.getInfo)
  .post('/api/echo', infoAPI.echo);

router.define('/api/auth')
  .post(userAPI.getToken)
  .put(userAPI.refreshToken);
