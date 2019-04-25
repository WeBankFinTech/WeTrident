#!/usr/bin/env node
const options = require('minimist')(process.argv.slice(2))


function run (root) {
  console.log(options)

  const cmd = options._[0]

  switch (cmd) {
    case 'init': {
      const init = require('./init').init
      const projectName = options._[1]
      init(root, projectName)
      break
    }
    case 'gen': {
      const gen = require('./gen')
      const name = options._[1]
      if (name === 'module') {
        gen.generatorModule()
      } else if (name === 'scene') {
        gen.generatorScene()
      } else {
        console.warn('know type, use `gen module` or `gen scene` ')
      }
      break
    }
  }
}


module.exports = {
  init: require('./init').init,
  run
}

