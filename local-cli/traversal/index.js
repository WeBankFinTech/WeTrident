const shell = require('shelljs')

function start (root) {
  let path = shell.exec('find . -name start-server.sh').stdout
  if (path) {
    let dictionary = path.replace('/start-server.sh', '/../../')
    shell.exec(`cd ${dictionary}`)
    shell.exec('sh ./traversal-server/scripts/start-server.sh')
  } else {
    shell.echo('Error: Can not find start scripts, check your environment and config please.');
    shell.exit(1)
  }
}

module.exports = {
  start
}
