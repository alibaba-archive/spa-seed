'use strict';

/**
 * POST /api/echo
 * 输出用户请求的内容
 * @api public
 */
exports.echo = function(Thunk) {
  // 如果是异步业务，则必须返回 thunk 或 promise 等，参考 https://github.com/thunks/thunks
  return this.parseBody(Thunk)(function(err, body) {
    this.body = body;
  });
};


/**
 * GET /api/info
 * 输出当前请求信息及平台信息
 * @api public
 */
exports.getInfo = function(Thunk) {
  this.body = {
    ip: this.ip,
    ips: this.ips,
    url: this.url,
    href: this.href,
    host: this.host,
    path: this.path,
    query: this.query,
    method: this.method,
    headers: this.headers,
    hostname: this.hostname,
    clientInfo: this.clientInfo
  };
};
