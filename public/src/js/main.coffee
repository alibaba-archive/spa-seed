require.config({
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery'
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap'
    'thunks': '../bower_components/thunks/thunks'
  }
  shim: {
    'bootstrap': ['jquery']
  }
})

require([
  'jquery'
  'thunks'
  'bootstrap'
], (
  $
  thunks
) ->

)
