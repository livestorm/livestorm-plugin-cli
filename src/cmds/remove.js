const env = process.argv[3]
const fetch = require('node-fetch')
const prompts = require('prompts')

const setLocalProxyIfNeeded = require('../helpers/setLocalProxyIfNeeded')
const setLocalHostIfNeeded = require('../helpers/setLocalHostIfNeeded')
const getPluginConfig = require('../helpers/getPluginConfig')

module.exports = function remove() {
  const config = getPluginConfig(env)

  if (!config.name) return console.log('The specified environnement does not have a name.')

  prompts({
    type: 'text',
    name: 'confirm',
    message: 'Are you sure you want to remove this plugin ? It will be removed from any organization using it. (yes/no)',
    validate: value => {
      return (value !== 'no' || value !== 'yes')
    }
  }).then((answer) => {
    if (answer.confirm === 'yes') {
      fetch(`${setLocalProxyIfNeeded(config)}/api/v1/plugins/${config.name}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'Application/JSON',
          'Authorization': config.apiToken || config.apiKey,
          ...setLocalHostIfNeeded(config)
        }
      })
      .then(handleResponse)
      .catch((err) => handleNetworkError(err, config))
    }
  })

}

function handleResponse({ status }) {
  if (status === 201 || status === 204) {
    console.log(`Successfully removed plugin`)
  } else {
    console.log(status)
    throw 'Deletion failed'
  }
}

function handleNetworkError(err, json) {
  console.log(err)
  console.log(`Failed to remove plugin ${json.name} from ${json.endpoint}.`)
  console.log('Make sure your internet connection is working and check https://status.livestorm.co/')
}