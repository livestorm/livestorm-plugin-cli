const { execSync } = require('child_process')
const { default: fetch } = require('node-fetch')
const prompts = require('prompts')
const semverGte = require('semver/functions/gte')
 
const configStore = require('../helpers/configStore.js')
const version = require('./version')

function checkCurrentVersion() {
  return version()
}

async function checkLatestVersion() {
  const response = await fetch('https://registry.npmjs.org/@livestorm/cli')
  const json = await response.json()
  return json['dist-tags']['latest']
}

module.exports = async () => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]
    const latestUpgradeDate = configStore.get('latestUpgradeDate')
    if (currentDate === latestUpgradeDate) return false

    configStore.set('latestUpgradeDate', currentDate)

    const currentVersion = checkCurrentVersion()
    const latestVersion = await checkLatestVersion()
    if (semverGte(currentVersion, latestVersion)) return false
    
    prompts({
      type: 'text',
      name: 'upgrade',
      message: "We noticed your CLI isn't up to date, do you want to upgrade? (yes/no)",
      validate: value => {
        return (value !== 'no' || value !== 'yes')
      }
    }).then(answer => {
      if (answer.upgrade === 'yes') {
        console.log('Upgrading @livestorm/cli ...')
        execSync('yarn global upgrade @livestorm/cli@latest')
        console.log('All done 🙌')
      }
      return true
    })
  }
  catch (error) {
    return false
  }
}
