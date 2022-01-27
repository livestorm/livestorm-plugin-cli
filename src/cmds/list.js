const { default: fetch } = require('node-fetch')
const commandLineArgs = require('command-line-args')
const getPluginConfig = require('../helpers/getPluginConfig')
const setLocalProxyIfNeeded = require('../helpers/setLocalProxyIfNeeded')
const setLocalHostIfNeeded = require('../helpers/setLocalHostIfNeeded')
const cliff = require('cliff')


module.exports = () => {
  const options = commandLineArgs([
    { name: 'list', defaultOption: true },
    { name: 'environment', alias: 'e', type: String },
    { name: 'api-token', alias: 't', type: String },
  ])
  
  const config = getConfigBasedOnInput(options)
  console.log('Fetching plugins corresponding to the organization linked with the API token...\n')
  
  fetch(`${setLocalProxyIfNeeded(config)}/api/v1/plugins`, {
    headers: { 
      'Content-Type': 'Application/JSON',
      'Authorization': config.apiToken || config.apiKey,
      ...setLocalHostIfNeeded(config)
    }
  })
    .then((res) => {
      if (res.status !== 200) return []
      return res.json()
    })
    .then((json) => handleResponse(json))
}

function getConfigBasedOnInput(options) {
  if (options.environment) {
    return getPluginConfig(options.environment)
  } else if (options['api-token']) {
    return { endpoint: 'https://plugins.livestorm.co', apiToken: options['api-token'] }
  } else {
    console.log('You must provide either a target environment or an API token using the --environment or --api-token flags.')
    process.exit()
  }
}

function handleResponse(response) {
  if (!response.plugins || !response.plugins.length) {
    return console.log('No plugins found on this organization.')
  }


  const rows = [
    ['ID', 'Name'],
    ...response.plugins.map((plugin) => [plugin.id, plugin.name])
  ]
  console.log(cliff.stringifyRows(rows, ['blue', 'blue']))
}