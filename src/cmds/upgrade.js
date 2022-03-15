const { execSync } = require('child_process')
const { default: fetch } = require('node-fetch')
const prompts = require('prompts')

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

function checkCurrentVersion() {
  const command = "yarn global list --pattern @livestorm/cli | grep -oP '@livestorm/cli@\K\d+.\d+.\d+'"
  return execSync(command)
}

function checkLatestVersion() {
  const response = await fetch('https://registry.npmjs.org/@livestorm/cli')
  const json = await response.json()
  return json['dist-tags']['latest']
}

module.exports = () => {
  try {
    const current = checkCurrentVersion()
    const latest = checkLatestVersion()
    if (compareVersions(current, latest) !== -1) return false
    
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
    })
  catch (error) {

  }
}
