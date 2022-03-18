const { execSync } = require('child_process')
const { default: fetch } = require('node-fetch')
const prompts = require('prompts')
const configStore = require('../helpers/configStore.js')

function compareVersions(current, latest) {
  let currentArr = current.split('.')
  let latestArr = latest.split('.')
  for (let i = 0; i < 3; i++) {
    let currentNum = Number(currentArr[i])
    let latestNum = Number(latestArr[i])
    if (currentNum > latestNum) return 1

    if (latestNum > currentNum) return -1

    if (!isNaN(currentNum) && isNaN(latestNum)) return 1

    if (isNaN(currentNum) && !isNaN(latestNum)) return -1
  }
  return 0
}

async function checkCurrentVersion() {
  const command = "yarn global list --pattern @livestorm/cli | grep -oP '@livestorm/cli@\K\d+.\d+.\d+'"
  return execSync(command)
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
    if (configStore.has('latestUpgradeDate') && currentDate === latestUpgradeDate) return false

    configStore.set('latestUpgradeDate', currentDate)

    const currentVersion = await checkCurrentVersion()
    const latestVersion = await checkLatestVersion()

    if (compareVersions(currentVersion, latestVersion) !== -1) return false
    
    prompts({
      type: 'text',
      name: 'upgrade',
      message: "We noticed your CLI isn't up to date, do you want to upgrade? (yes/no)",
      validate: value => {
        return (value !== 'no' || value !== 'yes')
      }
    }).then((answer) => {
      if (answer.upgrade === 'yes') {
        console.log('Upgrading @livestorm/cli ...')
        execSync('yarn global upgrade @livestorm/cli@latest')
        console.log('All done 🙌')
      }
      return true
    })
  catch (error) {
    return false
  }
}
