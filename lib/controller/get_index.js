'use strict'

module.exports = function *() {
  yield this.render('index', {
    user: this.state.user
  })
}
