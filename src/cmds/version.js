const fs = require('fs')

module.exports = () => {
  const file = fs.readFileSync('package.json', 'utf8')
  return JSON.parse(file).version
}