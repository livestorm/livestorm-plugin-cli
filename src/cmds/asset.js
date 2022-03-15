const path = require('path')
const uploadFileOrDirectory = require('../helpers/uploadFileOrDirectory')
const upgradeCliVersion = require('./upgrade')

module.exports = function asset() {
  upgradeCliVersion()
  let givenPath = process.argv[3]
  if (!givenPath) {
    console.log('Please specify the asset to upload')
    console.log('Usage: livestorm asset <file|directory>')
    process.exit(1)
  }
  givenPath = path.join(process.cwd(), givenPath)

  uploadFileOrDirectory(givenPath)
}
