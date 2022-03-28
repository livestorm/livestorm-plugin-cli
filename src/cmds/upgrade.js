const { execSync } = require('child_process')
const { default: fetch } = require('node-fetch')
const prompts = require('prompts')
const semverGte = require('semver/functions/gte')
 
const configStore = require('../helpers/configStore.js')
const checkCurrentVersion = require('./version').getModuleVersion

async function checkLatestVersion() {
  const response = await fetch('https://registry.npmjs.org/@livestorm/cli')
  const json = await response.json()
  return json['dist-tags']['latest']
}

async function checkCandidateForUpgrade() {
  try {
    configStore.delete('latestUpgradeDate')
    const currentDate = new Date().toISOString().split('T')[0]
    const latestUpgradeDate = configStore.get('latestUpgradeDate')
    if (currentDate === latestUpgradeDate) return false

    configStore.set('latestUpgradeDate', currentDate)

    const currentVersion = checkCurrentVersion()
    const latestVersion = await checkLatestVersion()
    if (semverGte(currentVersion, latestVersion)) return false

    return true
  }
  catch (error) {
    return false
  }
}

async function promptUpgrade() {
  prompts({
    type: 'text',
    name: 'upgrade',
    message: "We noticed your CLI isn't up to date, do you want to upgrade? (yes/no)",
    validate: value => {
      return (value !== 'no' || value !== 'yes')
    }
  }).then(answer => {
    if (answer.upgrade === 'yes') return true

    return false
  })
}

async function upgrade() {
  console.log('Upgrading @livestorm/cli to the latest version ...')
  execSync('yarn global upgrade @livestorm/cli@latest')
  console.log('All done 🙌')
}

async function checkAndUpgradeCliVersion() {
  const isCandidateForUpgrade = await checkCandidateForUpgrade()
  if (isCandidateForUpgrade) {
    const yes = await promptUpgrade()
    if (yes) {
      await upgrade()
    }
  }
}

module.exports = {
  checkAndUpgradeCliVersion,
  upgrade
}
