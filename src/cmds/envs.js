const cliff = require('cliff')
const configStore = require('../helpers/configStore.js')

const ENV_FIELDS = [
  'apiToken',
  'endpoint',
  'metadata',
  'permissions',
  'recorded',
]

function add(envName, data) {
  configStore.set(`envs.${envName}`, ENV_FIELDS.reduce((env, key) => {
    env[key] = data[key]
    return env
  }, {}))
}

function remove(envName) {
  configStore.delete(`envs.${envName}`)
}

function list() {
  /**
   * @type { import('../../types').Config['environments'] }
   */
  const envs = configStore.get('envs') || {}

  const rows = [
    ['name', ...ENV_FIELDS],
    ...Object.keys(envs).map(envName => [envName, ...ENV_FIELDS.map(key => envs[envName][key] ?? '(Not Set)')])
  ]
  console.log(cliff.stringifyRows(rows, ['blue']))
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
