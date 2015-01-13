'use strict';

/**
* 同步解析 session cookie
* @api private
*/
module.exports = function() {
  var user = {};
  var string = this.cookies.get(this.config.sessionName, {signed: true});
  if (string) {
    try {
      var body = JSON.parse(new Buffer(string, 'base64').toString('utf8'));
      user.name = body.user.name;
      user.email = body.user.email;
      user._userId = body.user._id;
      user.avatarUrl = body.user.avatarUrl;
    } catch (e) {}
  }
  this.user = user;
};
