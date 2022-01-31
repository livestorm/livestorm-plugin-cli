#!/usr/bin/env node
const minimist = require('minimist')
const availableCommands = require('./src/cmds')

const command = process.argv[2]
console.log(process.argv)

if (!command || !availableCommands[command]) {
  console.log('Usage: livestorm <command>')
  availableCommands.help()
  process.exit(1)
}
console.log(process.argv)
availableCommands[command](minimist(process.argv.slice(3)))