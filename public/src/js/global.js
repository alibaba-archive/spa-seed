'use strict';
/* global module, define */

define([], function() {
  var script = document.getElementById('app-global');
  script.parentNode.removeChild(script);

  return {
    NAME: 'spa-seed',
    apiHost: script.getAttribute('data-apihost'),
    accountHost: script.getAttribute('data-accounthost')
  };
});
