const fs = require('fs')
const path = require('path');

function getModuleVersion() {
  const file = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')
  return JSON.parse(file).version
}

function printModuleVersion() {
  console.log(getModuleVersion())
}

module.exports = {
  getModuleVersion,
  printModuleVersion
}
