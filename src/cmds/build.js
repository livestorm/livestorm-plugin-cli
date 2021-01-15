const { execSync } = require('child_process')
const fs = require('fs')

module.exports = () => {
  execSync('yarn build')
  return fs.readFileSync(`${process.cwd()}/build/bundle.js`)
}