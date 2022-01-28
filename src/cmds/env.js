const minimist = require('minimist')
// const Configstore = require('configstore');

async function add(envName, data) {
  console.log('-> add',  envName, data)
  const { default: Configstore } = await import('configstore')
  const config = new Configstore('livestorm-cli');
  config.set(`envs.${envName}`, data)
}

async function remove(envName) {
  console.log('-> remove',  envName)
  const { default: Configstore } = await import('configstore')
  const config = new Configstore('livestorm-cli')
  config.delete(`envs.${envName}`)
}

module.exports = function env() {
  console.log('env')
  const { _, ...argv } = minimist(process.argv.slice(2))
  const [ cmd, envName] = _

  if (cmd === 'add') {
    add(envName, argv)
  } else if (cmd === 'remove') {
    remove(envName)
  }
}
