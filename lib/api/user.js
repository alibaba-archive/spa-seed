'use strict'

/**
 * POST /api/auth
 * 如果验证成功，响应 token，否则响应对应的 http error
 * @api public
 */
exports.getToken = function () {
  // 直接从 teambition session cookie 中获取用户信息 `./modules/cookieAuth.js`，不使用登录验证
  if (!this.state.user || !this.state.user._id) this.throw(401)
  var token = this.signToken(this.state.user)
  this.body = {
    user: this.decodeToken(token),
    token: token,
    authorization: 'Bearer ' + token
  }
}

/**
 * PUT /api/auth
 * 基于已有的 token 认证生成新的 token，拥有新的生命周期，请求头必须存在有效的 Authorization
 * @api public
 */
exports.refreshToken = function () {
  var token = this.signToken(this.token)
  this.body = {
    user: this.decodeToken(token),
    token: token,
    authorization: 'Bearer ' + token
  }
}
