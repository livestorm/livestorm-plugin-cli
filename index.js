#!/usr/bin/env node
const availableCommands = require('./src/cmds')

const command = process.argv[2]

if (!command || !availableCommands[command]) {
  console.log('Usage: livestorm <command>')
  availableCommands.help()
  process.exit(1)
}

availableCommands[command]()