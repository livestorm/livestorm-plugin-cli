const { execSync } = require('child_process')
const nodeWatch = require('node-watch');
const debounce = require('debounce')
const env = process.argv[3]

function updatePlugin(evt, name) {
  console.log('Updating plugin');
  process.stdout.write('\x1b[0m.\x1b[0m')

  try {
    const res = execSync(`livestorm publish ${env || ''}`).toString()
    if (res.includes('Successfully')) {
      process.stdout.write('\x1b[92m.\x1b[32m')
      console.log('\x1b[0m')
    } else {
      throw(res)
    }
  } catch(err) {
    console.log('\x1b[31m', err.stdout.toString())
    console.log('\x1b[0m')
  }
}

module.exports = function watch() {
  console.log(`${env ? `Will publish to ${env}, ` : ''}waiting for file change...`)

  nodeWatch('./', { 
    recursive: true,
    filter: (f, skip) => {
      if (/node_modules/.test(f)) return skip;
      if (/.git/.test(f)) return skip;
      return true
    },
  }, debounce(updatePlugin, 300));    
}
