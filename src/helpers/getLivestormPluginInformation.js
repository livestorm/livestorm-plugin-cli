module.exports = function getLivestormPluginInformation(envName = 'development') {
  let json = require(`${process.cwd()}/package.json`)
  let foundEnv = null
  json.livestorm = json.livestorm || require(`${process.cwd()}/environments.json`)

  if (!json.livestorm) {
    throw 'Not a livestorm plugin'
  }
  console.log(`Livestorm plugin ${json.name} in version ${json.version} detected`)

  if (envName === 'development' && !json.livestorm[envName] && json.livestorm.apiKey) {
    foundEnv = json.livestorm
  } else if (json.livestorm[envName]) {
    foundEnv = json.livestorm[envName]
  } else {
    console.log(`Environment ${envName} not found in package.json. Make sure to define the corresponding env under the key "${envName}".`)
    process.exit()
  }

  if (!foundEnv.endpoint) foundEnv.endpoint =  'https://plugins.livestorm.co'
  return foundEnv
}
