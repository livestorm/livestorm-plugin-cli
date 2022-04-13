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

async function selectPackageManager() {
  const answer = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Select your package manager',
    choices: [
      { title: 'Yarn V1', value: 'yarn-v1' },
      { title: 'NPM', value: 'npm' },
      { title: 'pnpm', value: 'pnpm' },
      { title: 'Yarn V2', value: 'yarn-v2' },
    ],
    initial: 1
  })
  return answer.packageManager
}

async function upgrade() {
  const packageManager = await selectPackageManager()
  console.log('Upgrading @livestorm/cli to the latest version ...')

  switch (packageManager) {
    case 'yarn-v1':
      execSync('yarn global upgrade @livestorm/cli@latest')
      break
    case 'npm':
      execSync('npm update -g @livestorm/cli')
      break
    case 'pnpm':
      execSync('pnpm uninstall -g @livestorm/cli && pnpm install -g @livestorm/cli@latest')
      break
    case 'yarn-v2':
      console.log('Yarn V2 does not support global packages')
      console.log('Check this link for more info:')
      console.log('https://yarnpkg.com/getting-started/migration#use-yarn-dlx-instead-of-yarn-global')
      break
    default:
      throw 'Unknown package manager'
  }

  console.log('All done 🙌')
}

async function checkAndUpgradeCliVersion() {
  const isCandidateForUpgrade = await checkCandidateForUpgrade()
  if (isCandidateForUpgrade) {
    const yes = await promptUpgrade()
    if (yes) await upgrade()
  }
}

module.exports = {
  checkAndUpgradeCliVersion,
  upgrade
}
