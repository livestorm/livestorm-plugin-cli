const { execSync } = require('child_process')
const fs = require('fs')
const prompts = require('prompts')
const path = require('path')
const rimraf = require('rimraf')

const defaultMetadata = require('../helpers/defaultMetadata')
const upgradeCliVersion = require('./upgrade')

const questions = [
  {
    type: 'text',
    name: 'name',
    message: 'What is your plugin name ? Example: super-chat',
    validate: value => {
      if (value.length <= 1) return 'Name is too short'
      if (fs.existsSync(pathForPlugin(value))) return 'Directory is taken, please choose another name'
      return true
    }
  },
  {
    type: 'text',
    name: 'version',
    message: 'What is your plugin version ?',
    initial: '0.0.1'
  },
  {
    type: 'text',
    name: 'apiToken',
    message: 'What is your API token ?'
  }
]

function pathForPlugin(name) {
  return path.join(process.cwd(), directoryNameFor(name))
}

function directoryNameFor(name) {
  return `livestorm-plugin-${name}`
}


module.exports = () => {
  upgradeCliVersion()
  prompts(questions).then((answers) => {
    try {
      if (!answers.name || !answers.version) return
      console.log('Creating plugin...')
      execSync(`git clone -b liv-6574-update-the-plugin-boilerplate-to-match https://github.com/livestorm/livestorm-plugin-boilerplate.git livestorm-plugin-${answers.name}`)

      rimraf.sync(path.join(pathForPlugin(answers.name), '.git'))


      const defaultData = require(`${pathForPlugin(answers.name)}/package.json`)

      defaultData.name = answers.name
      defaultData.version = answers.version
      defaultData.description = answers.publicDescription || ''

      execSync(`cd ${pathForPlugin(answers.name)} && yarn`)

      fs.writeFileSync(
        `./livestorm-plugin-${answers.name}/package.json`,
        JSON.stringify(defaultData, null, 2)
      )

      const config = require(`${pathForPlugin(answers.name)}/livestorm.config.js`)
      config.name = answers.name
      config.apiToken = answers.apiToken || ''
      config.metadata = defaultMetadata(answers)
      fs.writeFileSync(
        `./livestorm-plugin-${answers.name}/livestorm.config.js`,
        `module.exports = ${JSON.stringify(config, null, 2)}`
      )

      execSync(`cd ${pathForPlugin(answers.name)} && git init && git add --a && git commit -m "First commit"`)

      console.log('All done 🙌')
      console.log(`If you need to change any of the pre-given answers feel free to edit ./${directoryNameFor(answers.name)}/livestorm.config.js`)
      console.log(`You can start coding by opening ./${directoryNameFor(answers.name)}/index.ts`)
      console.log(`Visit https://github.com/livestorm/livestorm-plugin for documentation`)
    } catch (err) {
      rimraf(pathForPlugin(answers.name))
      console.log('Oops, an error happened. Please drop us an email with the error detail.')
    }
  })
}