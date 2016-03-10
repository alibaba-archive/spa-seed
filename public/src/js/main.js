'use strict'

require.config({
  paths: {
    'jquery': '../bower/jquery/dist/jquery',
    'bootstrap': '../bower/bootstrap/dist/js/bootstrap',
    'thunks': '../bower/thunks/thunks'
  },
  shim: {
    'bootstrap': ['jquery']
  }
})

require([
  'jquery',
  'thunks',
  'global',
  'bootstrap'
], function ($, thunks, global) {})
