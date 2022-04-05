const { default: fetch } = require('node-fetch')
const commandLineArgs = require('command-line-args')
const { Table } = require('console-table-printer')
const chalk = require('chalk')

const getLivestormConfig = require('../helpers/getLivestormConfig')
const setLocalProxyIfNeeded = require('../helpers/setLocalProxyIfNeeded')
const setLocalHostIfNeeded = require('../helpers/setLocalHostIfNeeded')

module.exports = async () => {
  const options = commandLineArgs([
    { name: 'list', defaultOption: true },
    { name: 'environment', alias: 'e', type: String },
    { name: 'api-token', alias: 't', type: String },
  ])
  
  const config = await getConfigBasedOnInput(options)
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

async function getConfigBasedOnInput(options) {
  if (options.environment || !options['api-token']) {
    let config
    try {
      config = await getLivestormConfig(options.environment)
    } catch(err) {
      console.log('\x1b[31m', err.toString())
      process.exit(1);
    }
    return config
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

  const table = new Table({
    columns: [
      {
        name: 'id',
        title: chalk.blue('ID'), 
        alignment: 'left'
      },
      {
        name: 'name',
        title: chalk.blue('Name'),
        alignment: 'left' 
      }
    ]
  })

  const rows = response.plugins.map((plugin) => ({ id: plugin.id, name: plugin.name }))
  table.addRows(rows)
  table.printTable()
}