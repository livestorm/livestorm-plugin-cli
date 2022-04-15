const fs = require('fs')
const path = require('path')
const { default: fetch } = require('node-fetch')
const semverGte = require('semver/functions/gte')

function checkCurrentVersion() {
  const file = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')
  return JSON.parse(file).version
}

async function checkLatestVersion() {
  const response = await fetch('https://registry.npmjs.org/@livestorm/cli')
  const json = await response.json()
  return json['dist-tags']['latest']
}

async function printModuleVersion() {
  const currentVersion = checkCurrentVersion()
  const latestVersion = await checkLatestVersion()

  console.log(`Current version: ${currentVersion}`)
  if (semverGte(currentVersion, latestVersion)) {
    return console.log('You are using the latest version')
  }

  console.log(`You can upgrade to ${latestVersion} with \`livestorm upgrade\``)
}

module.exports = {
  checkCurrentVersion,
  printModuleVersion,
  checkLatestVersion
}
