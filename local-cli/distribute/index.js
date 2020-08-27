const shell = require('shelljs')

function androidPack (root) {
  const path = shell.exec('find . -name AndroidChannelPackager.sh').stdout
  if (path) {
    const dictionary = path.replace('/AndroidChannelPackager.sh', '')
    shell.cd(dictionary)
    shell.exec('./AndroidChannelPackager.sh')
    shell.exit(1)
  } else {
    shell.echo('Error: Can not find package scripts')
    shell.exit(1)
  }
}

module.exports = {
  androidPack
}
