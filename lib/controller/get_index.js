'use strict'

exports.getIndex = function * () {
  yield this.render('index', {
    user: this.state.user
  })
}
