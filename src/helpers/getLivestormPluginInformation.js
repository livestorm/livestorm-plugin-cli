module.exports = function getLivestormPluginInformation() {
  const json = require(`${process.cwd()}/package.json`)
  if (!json.livestorm) throw 'Not a livestorm plugin'
  console.log(`Livestorm plugin ${json.name} in version ${json.version} detected`)
  return json
}
