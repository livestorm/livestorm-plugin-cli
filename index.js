#!/usr/bin/env node
const minimist = require('minimist')
const availableCommands = require('./src/cmds')
const { checkAndUpgradeCliVersion } = require('./src/cmds/upgrade')

async function executeCommand() {
  await checkAndUpgradeCliVersion()

  const command = process.argv[2]

  if (!command || !availableCommands[command]) {
    console.log('Usage: livestorm <command>')
    availableCommands.help()
    process.exit(1)
  }

  availableCommands[command](minimist(process.argv.slice(3)))
}

executeCommand()
