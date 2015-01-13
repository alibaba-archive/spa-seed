define([], ->
  script = document.getElementById('spa-global')
  script.parentNode.removeChild(script)

  return {
    NAME: 'spa-seed'
    apiHost: script.getAttribute('data-apihost')
    accountHost: script.getAttribute('data-accounthost')
  }
)
