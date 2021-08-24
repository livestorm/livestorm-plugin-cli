const { exec } = require('child_process')
const prompts = require('prompts')
const rimraf = require('rimraf')
const Zip = require('adm-zip')
const crypto = require('crypto')
const fetch = require('node-fetch')
const { execSync } = require('child_process')

const uploadFileOrDirectory = require('../helpers/uploadFileOrDirectory')
const getLivestormPluginInformation = require('../helpers/getLivestormPluginInformation')
const livestormDomain = require('../helpers/livestormDomain')

const questions = [
  {
    type: 'multiselect',
    name: 'purposes',
    message: 'What does your plugin need a review for?',
    choices: [
      { title: 'I want to publish it in Livestorm\'s apps marketplace', value: 'marketplace' },
      { title: 'I want to submit my plugin for the hackathon', value: 'hackathon' },
      { title: 'I need to use the \'allow-same-origin\' flag on an iframe', value: 'allow-same-origin' },
      { title: 'I need to use a private API', value: 'private-api' }
    ],
    hint: 'Use arrows to browse and space bar to toggle',
    instructions: false,
    min: 1
  },
  {
    type: 'text',
    name: 'comment',
    message: 'Is there anything else you\'d like to communicate to the review team?',
  },
  {
    type: 'text',
    name: 'email',
    validate: (value) => {
      if (/^\S+@\S+\.\S+$/.test(value)) return true
    },
    message: 'Please enter an email so that we can get in touch with you if needed',
  }
]

function createZip() {
  console.log('Deleting node_modules folder to reduce archive size...')
  rimraf.sync('./node_modules')
  console.log('Creating zip...')

  const name = `tmp-${crypto.randomBytes(15).toString('hex')}.zip`
  const zip = new Zip()
  zip.addLocalFolder('./')
  zip.deleteFile('__tests__/')
  zip.deleteFile('environments.json')
  zip.deleteFile('build/')
  zip.deleteFile('.git/')
  zip.writeZip(name)

  console.log('Recreating node_modules folder...')
  exec('yarn')
  return name
}

async function uploadZip(zipFile) {
  console.log('Uploading zip...')
  const url = await uploadFileOrDirectory(zipFile, false)
  rimraf.sync(`./${zipFile}`)
  return url
}

module.exports = async function review() {
  try {
    const config = getLivestormPluginInformation('production')
    console.log(`Starting review process for '${config.name}'…`)
    const answers = await prompts(questions)

    if (answers.purposes.find((purpose => purpose == 'marketplace'))) {
      console.log('Syncing plugin code...')
      execSync('livestorm publish production')
      answers.metadata = config.metadata || require(`${process.cwd()}/marketplace.json`)
    }

    const zipUrl = await uploadZip(createZip())
  
    console.log('Sending review request...')
  
    const res = await fetch(`${livestormDomain}/api/v1/plugins/${config.name}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        ...answers,
        zip_url: zipUrl
      }),
      headers: {
        'Content-Type': 'Application/JSON',
        'Authorization': config.apiToken || config.apiKey
      }
    })
    if (res.status === 201) {
      console.log(`Done! Your review has been sent, we'll get back to you shortly at ${answers.email}.`)
    } else {
      throw 'Incorrect status code'
    }
  } catch(err) {
    console.log(err)
    console.log('Failed to send review request, please contact us at plugins@livestorm.co')
  }
}
