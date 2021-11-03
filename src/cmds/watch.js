const fs = require('fs')
const { execSync } = require('child_process')
const getLivestormPluginInformation = require('../helpers/getLivestormPluginInformation')
const env = process.argv[3]
const nodeWatch = require('node-watch');


function updatePlugin(evt, name) {
  console.log('%s changed', name);
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
  getLivestormPluginInformation(env)
  console.log(`${env ? `Will publish to ${env}, ` : ''}waiting for file change...`)

  nodeWatch('./', { 
    recursive: true,
    filter: (f, skip) => {
      if (/\/node_modules/.test(f)) return skip;
      if (/\/build/.test(f)) return skip;
      return true
    },
  }, updatePlugin);    
}