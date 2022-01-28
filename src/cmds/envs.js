const minimist = require('minimist')
const configStore = require('../helpers/configStore.js')

async function add(envName, data) {
  console.log('-> add',  envName, data)
  configStore.set(`envs.${envName}`, data)
}

async function remove(envName) {
  console.log('-> remove',  envName)
  configStore.delete(`envs.${envName}`)
}

async function list() {
  console.log('-> list')
  console.log(configStore.get('envs'))
}

module.exports = function envs() {
  console.log('envs')
  const { _, ...argv } = minimist(process.argv.slice(2))
  const [ cmd, envName] = _

  if (cmd === 'add') {
    add(envName, argv)
  } else if (cmd === 'remove') {
    remove(envName)
  } else if (cmd === 'list') {
    list()
  }
}
