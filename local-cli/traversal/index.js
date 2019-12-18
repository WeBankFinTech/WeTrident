const shell = require('shelljs')

function start (root) {
  const path = shell.exec('find . -name start-server.sh').stdout
  if (path) {
    const dictionary = path.replace('/start-server.sh', '/../../')
    shell.cd(dictionary)
    shell.exec('sh ./traversal-server/scripts/start-server.sh')
  } else {
    shell.echo('Error: Can not find start scripts, check your environment and config please.')
    shell.exit(1)
  }
}

module.exports = {
  start
}
