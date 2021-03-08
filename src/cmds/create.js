const { execSync } = require('child_process')
const fs = require('fs')
const prompts = require('prompts')

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
    name: 'apiKey',
    message: 'What is your API key ?'
  },
  {
    type: 'text',
    name: 'publicName',
    message: 'Choose a name that will be publicly displayed (it can be changed later) ?'
  },
  {
    type: 'text',
    name: 'publicDescription',
    message: 'Describe your package briefly'
  },
]

function pathForPlugin(name) {
  return `${process.cwd()}/${directoryNameFor(name)}`
}

function directoryNameFor(name) {
  return `livestorm-plugin-${name}`
}


module.exports = () => {
  prompts(questions).then((answers) => {
    try {
      if (!answers.name || !answers.version) return
      console.log('Creating plugin...')
      execSync(`git clone git@github.com:livestorm/livestorm-plugin-example.git livestorm-plugin-${answers.name}`)
      execSync(`rm -rf ${pathForPlugin(answers.name)}/.git`)
      
      const defaultData = require(`${pathForPlugin(answers.name)}/package.json`)
      
      defaultData.name = answers.name
      defaultData.version = answers.version
      defaultData.description = answers.publicDescription || ''
      defaultData.livestorm.development.name = answers.name
      defaultData.livestorm.development.apiKey = answers.apiKey || ''

      execSync(`cd ${pathForPlugin(answers.name)} && yarn`)
      
      fs.writeFileSync(
        `./livestorm-plugin-${answers.name}/package.json`,
        JSON.stringify(defaultData, null, 2)
      )

      execSync(`cd ${pathForPlugin(answers.name)} && git init && git add --a && git commit -m "First commit"`)

      console.log('All done 🙌')
      console.log(`If you need to change any of the pre-given answers feel free to edit ./${directoryNameFor(answers.name)}/package.json`)
      console.log(`You can start coding by opening ./${directoryNameFor(answers.name)}/index.ts`)
      console.log(`Visit https://github.com/livestorm/livestorm-plugin for documentation`)
    } catch(err) {
      console.log(err)
      console.log('Oups, an error happened. Please drop us an email with the error detail.')
      execSync(`rm -rf ${pathForPlugin(answers.name)}`)
    }
  })
}