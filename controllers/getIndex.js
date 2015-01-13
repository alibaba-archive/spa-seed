'use strict';

module.exports = function*(Thunk) {
  yield this.render('index', {
    user: this.user,
    ua: this.clientInfo
  });
};
