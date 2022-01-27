const build = require('./build')
const fetch = require('node-fetch')

const getPluginConfig = require('../helpers/getPluginConfig')
const setLocalProxyIfNeeded = require('../helpers/setLocalProxyIfNeeded')
const setLocalHostIfNeeded = require('../helpers/setLocalHostIfNeeded')

function sendToLivestormAPI(config, fileContent) {
  console.log(`Sending plugin to ${config.endpoint}`)
  
  const data = Buffer.from(fileContent).toString('base64')

  fetch(`${setLocalProxyIfNeeded(config)}/api/v1/plugins`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'Application/JSON',
      'Authorization': config.apiToken || config.apiKey,
      ...setLocalHostIfNeeded(config)
    },
    body: JSON.stringify({ ...config, data })
  })
    .then(handleResponse)
    .catch((err) => handleNetworkError(err, config))
}

function handleResponse({ status }) {
  if (status === 201 || status === 204) {
    console.log(`Successfully ${status === 201 ? 'created' : 'updated'} plugin 🎉`)
  } else {
    if (status === 401) console.log('your API token seems to be incorrect. Please verify that it is valid')
    else if (status === 422) console.log('you must set a "name" property to your environment')
    else console.log('upload failed with status ' + status)
    process.exit(1);
  }
}

function handleNetworkError(err, json) {
  console.log(err)
  console.log(`Failed to send plugin to ${json.endpoint}.`)
  console.log('Make sure your internet connection is working and check https://status.livestorm.co/')
  process.exit(1);
}

module.exports = function publish() {
  try {
    sendToLivestormAPI(
      getPluginConfig(process.argv[3]),
      build()
    )
  } catch(err) {
    console.log('\x1b[31m', err.toString())
    console.log('\x1b[0m', 'Are you sure directory is a valid Livestorm plugin ?')
    process.exit(1);
  }
}
