'use strict'

const toaMorgan = require('toa-morgan')

module.exports = toaMorgan
  .token('remote-user', function () {
    return this.state.uid || '-'
  })
  .token('remote-addr', function () {
    return this.state.ip
  })
  .format('production', '[:date[iso]] INFO {"class":"morgan-spa","raw":"$$$:remote-user$:remote-addr$:method$:url$:status$:response-time$:user-agent"}')
