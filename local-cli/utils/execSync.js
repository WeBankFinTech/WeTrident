const execSync = (cmd) => {
  if (process.env.useLocal === 'true') {
    console.log(cmd)
  }
  require('child_process').execSync(cmd, { stdio: 'inherit' })
}

module.exports = execSync
