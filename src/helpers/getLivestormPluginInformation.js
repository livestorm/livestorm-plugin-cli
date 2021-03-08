module.exports = function getLivestormPluginInformation(envName = 'development') {
  const json = require(`${process.cwd()}/package.json`)
  if (!json.livestorm) throw 'Not a livestorm plugin'
  console.log(`Livestorm plugin ${json.name} in version ${json.version} detected`)

  if (envName === 'development' && !json.livestorm[envName] && json.livestorm.apiKey) {
    return json.livestorm
  } else if (json.livestorm[envName]) {
    return json.livestorm[envName]
  } else {
    console.log(`Environment ${envName} not found in package.json. Make sure to define the corresponding env under the key "${envName}".`)
    process.exit()
  }
}
