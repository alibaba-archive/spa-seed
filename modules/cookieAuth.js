'use strict';

/**
* 同步解析 session cookie
* @api private
*/
module.exports = function(ctx) {
  var user = {};
  var string = ctx.cookies.get(ctx.config.sessionName, {signed: true});
  if (string) {
    try {
      var body = JSON.parse(new Buffer(string, 'base64').toString('utf8'));
      user._id = body.user._id;
      user.name = body.user.name;
      user.email = body.user.email;
      user.avatarUrl = body.user.avatarUrl;
    } catch (e) {}
  }
  return user;
};
