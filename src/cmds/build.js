const { execSync } = require('child_process')
const fs = require('fs')
const upgradeCliVersion = require('./upgrade')

module.exports = () => {
  upgradeCliVersion()
  console.log(`Bundling plugin...`)
  execSync('yarn build')
  console.log(`Bundling done`)
  return fs.readFileSync(`${process.cwd()}/build/bundle.js`)
}