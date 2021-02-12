const build = require('./build')
const fetch = require('node-fetch')
const getLivestormPluginInformation = require('../helpers/getLivestormPluginInformation')

function setLocalProxyIfNeeded(config) {
  if (config.endpoint.includes('plugins.livestorm.local')) {
    return 'http://localhost:4004'
  }
}

function setLocalHostIfNeeded(config) {
  if (config.endpoint.includes('plugins.livestorm.local')) {
    return { 'Host': 'plugins.livestorm.local' }
  } else {
    return {}
  }
}

function sendToLivestormAPI(json, fileContent) {
  console.log(`Sending plugin to ${json.livestorm.endpoint}`)
  
  const data = Buffer.from(fileContent).toString('base64')

  fetch(`${setLocalProxyIfNeeded(json.livestorm)}/api/v1/plugins`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'Application/JSON',
      'Authorization': json.livestorm.apiKey,
      ...setLocalHostIfNeeded(json.livestorm)
    },
    body: JSON.stringify({ ...json.livestorm, data })
  })
    .then(handleResponse)
    .catch((err) => handleNetworkError(err, json))
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
  console.log(`Failed to send plugin to ${json.livestorm.endpoint}.`)
  console.log('Make sure your internet connection is working and check https://status.livestorm.co/')
}

module.exports = function publish() {
  try {
    sendToLivestormAPI(
      getLivestormPluginInformation(),
      build()
    )
  } catch(err) {
    console.log(err)
    console.log('Are you sure directory is a valid Livestorm plugin ?')
  }
}
