#!/usr/bin/env node

let availableCommands = {
  push() {

  },

  help() {
    console.log('Available commands are : ', availableCommands.keys.join(','))
  }
}

const command = process.argv[2]

if (!command) {
  console.log('usage livestorm <command>');
  availableCommands.help()
  process.exit(1);
}

availableCommands[command]()