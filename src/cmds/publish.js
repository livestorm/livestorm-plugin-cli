const build = require('./build')
const fetch = require('node-fetch')

const getLivestormPluginInformation = require('../helpers/getLivestormPluginInformation')
const setLocalProxyIfNeeded = require('../helpers/setLocalProxyIfNeeded')
const setLocalHostIfNeeded = require('../helpers/setLocalHostIfNeeded')

function sendToLivestormAPI(config, fileContent) {
  console.log(`Sending plugin to ${config.endpoint}`)
  
  const data = Buffer.from(fileContent).toString('base64')

  fetch(`${setLocalProxyIfNeeded(config)}/api/v1/plugins`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'Application/JSON',
      'Authorization': config.apiKey,
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
    console.log(status)
    throw 'update failed'
  }
}

function handleNetworkError(err, json) {
  console.log(err)
  console.log(`Failed to send plugin to ${json.endpoint}.`)
  console.log('Make sure your internet connection is working and check https://status.livestorm.co/')
}

module.exports = function publish() {
  try {
    sendToLivestormAPI(
      getLivestormPluginInformation(process.argv[3]),
      build()
    )
  } catch(err) {
    console.log(err)
    console.log('Are you sure directory is a valid Livestorm plugin ?')
  }
}
