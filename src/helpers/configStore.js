const fs = require('fs')
const Configstore = require('configstore');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Create a Configstore instance.
module.exports = new Configstore(`${packageJson.name }`);