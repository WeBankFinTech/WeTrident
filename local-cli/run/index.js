const execRNCmd = require('../utils/execRNCmd')

const runAndroid = (options) => {
  if (!options['main-activity']) {
    // default pacakge name and MainActivity name
    options['main-activity'] = 'io.unpourtous.trident.MainActivity'
  }

  execRNCmd('local-cli/cli.js run-android ' + compositeArguments(options), 'node')
}

const runIOS = (options) => {
  if (!options.scheme) {
    options.scheme = 'Build'
  }
  execRNCmd('local-cli/cli.js run-ios ' + compositeArguments(options), 'node')
}

const compositeArguments = (options) => {
  return Object.keys(options)
    .filter(k => k !== '_')
    .map((k) => {
      const v = options[k]
      if (k && v) {
        return `--${k} ${v}`
      }
      return ''
    }).join(' ')
}

module.exports = {
  runAndroid,
  runIOS
}
