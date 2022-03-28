const fs = require('fs')

function getModuleVersion() {
  const file = fs.readFileSync('package.json', 'utf8')
  return JSON.parse(file).version
}

function printModuleVersion() {
  console.log(getModuleVersion())
}

module.exports = {
  getModuleVersion,
  printModuleVersion
}
