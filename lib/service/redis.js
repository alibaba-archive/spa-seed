'use strict'

const ilog = require('ilog')
const config = require('config')
const redis = require('thunk-redis')

const client = redis.createClient(config.redisHosts)

client
  .on('error', function (err) {
    err.class = 'thunk-redis'
    ilog.error(err)
    if (err.code === 'ENETUNREACH') throw err
  })
  .on('close', function (err) {
    err = err || new Error('Redis client closed!')
    err.class = 'thunk-redis'
    ilog.error(err)
    throw err
  })

exports.client = client
