const configStore = require('./configStore.js')
const prompts = require('prompts')

const livestormDomain = require('./livestormDomain')

/**
 * @typedef {Object} LivestormConfig
 * @property {string} name - The name of the plugin
 * @property {Object} metadata - The metadata
 * @property {string} apiToken - The API KEY
 * @property {string} endpoint - The endpoint
 */

/**
 * Returns the Livestorm Config with the targeted env
 * @return {LivestormConfig} 
 */
module.exports = async function getLivestormConfig(envName = 'development') {
  let fullLivestormConfig = null

  try {
    fullLivestormConfig = require(`${process.cwd()}/livestorm.config.js`)
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw 'The livestorm conf file is missing.'
    }
    throw 'The livestorm conf file seems broken.'
  }

  const { environments, ...livestormConfig} = fullLivestormConfig

  let env = environments[envName]
  const globalEnv = configStore.get(`envs.${envName}`)

  if (env && globalEnv) {
    const { selectedEnv }  = await prompts({
      type: 'select',
      name: 'selectedEnv',
      message: `We have found 2 environments for ${envName}. Select the one you want to use`,
      choices: [
        { title: 'Local', value: 'local' },
        { title: 'Global', value: 'global' },
      ],
      initial: 1
      
    })
    
    if (selectedEnv === 'global') {
      env = {
        ...env,
        globalEnv,
      }
    }
  } else if (!env && !globalEnv) {
    throw `Environment ${envName} was not found.`
  }

  env.endpoint ||= livestormDomain

  return {
    ...livestormConfig,
    ...env
  }

  // let json = require(`${process.cwd()}/package.json`)
  // let foundEnv = null
  // json.livestorm = json.livestorm || require(`${process.cwd()}/environments.json`)

  // if (!json.livestorm) {
  //   throw 'Not a livestorm plugin'
  // }
  // console.log(`Livestorm plugin ${json.name} in version ${json.version} detected`)

  // if (envName === 'development' && !json.livestorm[envName] && (json.livestorm.apiToken || json.livestorm.apiKey)) {
  //   foundEnv = json.livestorm
  // } else if (json.livestorm[envName]) {
  //   foundEnv = json.livestorm[envName]
  // } else {
  //   console.log(`Environment ${envName} not found in package.json. Make sure to define the corresponding env under the key "${envName}".`)
  //   process.exit()
  // }

  // if (!foundEnv.endpoint) foundEnv.endpoint =  livestormDomain
  // console.log('foundEnv', foundEnv)
  // return 1
}
