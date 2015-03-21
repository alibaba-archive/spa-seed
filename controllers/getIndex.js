'use strict';

module.exports = function(Thunk) {
  return this.render('index', {
    user: this.user
  });
};
