const fs = require('fs')
const { execSync } = require('child_process')
const getLivestormPluginInformation = require('../helpers/getLivestormPluginInformation')

function updatePlugin() {
  process.stdout.write('\x1b[0m.\x1b[0m')
  const res = execSync('livestorm publish').toString()
  if (res.includes('Successfully')) {
    process.stdout.write('\x1b[92m.\x1b[32m')
    console.log('\x1b[0m')
  } else {
    console.log(res)
  }
}

module.exports = function watch() {
  getLivestormPluginInformation()
  console.log('waiting for file change...')

  fs.watch(process.cwd(), updatePlugin)
  if (fs.existsSync(`${process.cwd()}/src`)) fs.watch(`${process.cwd()}/src`, updatePlugin)
}