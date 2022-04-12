const { Table } = require('console-table-printer')
const chalk = require('chalk')
const zibObject = require('lodash/zipObject')
const configStore = require('../helpers/configStore.js')

const ENV_CONFIG_FIELDS = [
  'apiToken',
  'endpoint',
  'metadata',
  'permissions',
  'recorded',
]

function add(envName, data) {
  if (!envName) {
    return console.log('\x1b[31m', 'The environment name is missing.')

  }

  const output = ENV_CONFIG_FIELDS.reduce((env, key) => {
    if (key in data) {
      env[key] = data[key]
    }
    return env
  }, {})

  if (data['api-token']) {
    output.apiToken = data['api-token']
  }

  const outputIsValid = Object.keys(output).some(key => ENV_CONFIG_FIELDS.includes(key))

  if (!outputIsValid) {
    return console.log('\x1b[31m', 'The configuration should contain at least one property.')
  }

  configStore.set(`envs.${envName}`, output)

  if (configStore.has(`envs.${envName}`)) {
    console.log('\x1b[32m', `The configuration for the environment ${envName} has been added.`)
  } else {
    console.log('\x1b[31m', 'Something went wrong.')
  }
}

function remove(envName) {
  configStore.delete(`envs.${envName}`)

  if (!configStore.has(`envs.${envName}`)) {
    console.log('\x1b[32m', `The configuration for the environment ${envName} has been removed.`)
  } else {
    console.log('\x1b[31m', 'Something went wrong.')
  }
}

function list() {
  /**
   * @type { import('../../types').ExtendedConfig['environments'] }
   */
  const envs = configStore.get('envs') || {}

  const envsKeys = Object.keys(envs)

  if (envsKeys.length === 0) {
    return console.log('There are no stored environments.')
  }

  const headers = ['name', ...ENV_CONFIG_FIELDS]
  const table = new Table({
    columns: headers.map(field => {
      return { 
        name: field, 
        title: chalk.blue(field),
        alignment: 'left'
      }
    })    
  })
  const rowArrays = envsKeys.map(envName => [envName, ...ENV_CONFIG_FIELDS.map(key => envs[envName][key] ?? '(Not Set)')])
  const rows = rowArrays.map(row => zibObject(headers, row))
  table.addRows(rows)
  table.printTable()
}

module.exports = function envs(argv) {
  const { _, ...data } = argv
  const [cmd, envName] = _

  if (cmd === 'add') {
    add(envName, data)
  } else if (cmd === 'remove') {
    remove(envName)
  } else if (cmd === 'list') {
    list()
  }
}
