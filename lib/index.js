var path = require('path')

var createPattern = function (pattern) {
  return { pattern: pattern, included: true, served: true, watched: false }
}

var initTAPE = function (files) {
  files.unshift(createPattern(path.join(__dirname, 'adapter.js')))
  files.unshift(createPattern(path.join(__dirname, 'tape.js')))
}

initTAPE.$inject = ['config.files']

module.exports = {
  'framework:tape': ['factory', initTAPE]
}
