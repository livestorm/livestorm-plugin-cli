const { execSync } = require('child_process')
const prompts = require('prompts')
const semverGte = require('semver/functions/gte')
 
const configStore = require('../helpers/configStore.js')
const { checkCurrentVersion, checkLatestVersion } = require('./version')

async function checkCandidateForUpgrade() {
  try {
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
  const answer = await prompts({
    type: 'text',
    name: 'upgrade',
    message: "We noticed your CLI isn't up to date, do you want to upgrade? (yes/no)",
    validate: value => {
      return (value !== 'no' || value !== 'yes')
    }
  })
  if (answer.upgrade === 'yes') return true

  return false
}

function upgrade() {
  console.log('Upgrading @livestorm/cli to the latest version ...')
  execSync('yarn global upgrade @livestorm/cli@latest', { stdio: 'inherit' })
}

async function checkAndUpgradeCliVersion() {
  const isCandidateForUpgrade = await checkCandidateForUpgrade()
  if (isCandidateForUpgrade) {
    const yes = await promptUpgrade()
    if (yes) upgrade()
  }
}

module.exports = {
  checkAndUpgradeCliVersion,
  upgrade
}
