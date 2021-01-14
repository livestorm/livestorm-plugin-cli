#!/usr/bin/env node
const { execSync } = require('child_process')
const fetch = require('node-fetch')
fs = require('fs')

const availableCommands = {
  build() {
    return execSync('yarn build')
  },

  push() {
    try {
      const json = require(`${process.cwd()}/package.json`)
      if (!json.livestorm) throw 'Not a livestorm plugin'

      console.log(`Livestorm plugin ${json.name} in version ${json.version} detected`)
      console.log(`Bundling plugin...`)

      availableCommands.build()
      const fileContent = fs.readFileSync(`${process.cwd()}/build/bundle.js`)
      
      console.log(`Bundling done`)
      console.log(`Sending plugin to ${json.livestorm.endpoint}`)

      fetch(`${json.livestorm.endpoint}/api/v1/plugins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: {
          ...json.livestorm,
          data: Buffer.from(fileContent).toString('base64')
        }
      })
        .then(res => {
          if (res.status === 201 || res.status === 200) {
            console.log(`Successfully ${res.status === 201 ? 'created' : 'updated'} plugin 🎉`)
          } else {
            throw 'update failed'
          }
        })
        .catch(() => console.log(`Failed to send plugin to ${json.livestorm.endpoint}`))
    } catch(err) {
      console.log('Directory does not seem to be a livestorm plugin')
    }
  },

  help() {
    console.log('Available commands are :', Object.keys(availableCommands))
  }
}

const command = process.argv[2]

if (!command || !availableCommands[command]) {
  console.log('Usage: livestorm <command>')
  availableCommands.help()
  process.exit(1)
}

availableCommands[command]()