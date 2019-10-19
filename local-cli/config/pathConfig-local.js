const path = require('path')

// project root as root
module.exports = {
  modulesPath: 'src/modules/',
  moduleTplPath: path.join(process.cwd(),  '../local-cli/gen/codeTemplate/moduleTpl'),
  sceneTplPath: path.join(process.cwd(), '../local-cli/gen/codeTemplate/sceneTpl')
}
