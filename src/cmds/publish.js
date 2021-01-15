const build = require('./build')
const fetch = require('node-fetch')

function getLivestormPluginInformation() {
  const json = require(`${process.cwd()}/package.json`)
  if (!json.livestorm) throw 'Not a livestorm plugin'
  return json
}

function sendToLivestormAPI(json, fileContent) {
  fetch(`${json.livestorm.endpoint}/api/v1/plugins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON'
    },
    body: {
      ...json.livestorm,
      data: Buffer.from(fileContent).toString('base64')
    }
  })
    .then(handleResponse)
    .catch(() => handleNetworkError(json))
}

function handleResponse({ status }) {
  if (status === 201 || status === 200) {
    console.log(`Successfully ${status === 201 ? 'created' : 'updated'} plugin 🎉`)
  } else {
    throw 'update failed'
  }
}

function handleNetworkError(json) {
  console.log(`Failed to send plugin to ${json.livestorm.endpoint}`)
}

module.exports = function publish() {
  try {
    const json = getLivestormPluginInformation()

    console.log(`Livestorm plugin ${json.name} in version ${json.version} detected`)
    console.log(`Bundling plugin...`)

    const fileContent = build()
    
    console.log(`Bundling done`)
    console.log(`Sending plugin to ${json.livestorm.endpoint}`)

    sendToLivestormAPI(json, fileContent)
  } catch(err) {
    console.log(err)
    console.log('Are you sure directory is a valid Livestorm plugin ?')
  }
}
