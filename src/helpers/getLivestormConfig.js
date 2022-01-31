const configStore = require('./configStore.js')
const prompts = require('prompts')

const livestormDomain = require('./livestormDomain')

/**
 * 
 * @typedef { import('../types/LivestormConfig').Config } LivestormConfig
 * @typedef { import('../types/LivestormConfig').Environment } LivestormEnvironment
 */

module.exports = async function getLivestormConfig(envName = 'development') {
  /**
   * 
   * @type { (LivestormConfig }
   */
  let livestormConfig = null

  try {
    livestormConfig = require(`${process.cwd()}/livestorm.config.js`)
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw 'The livestorm conf file is missing.'
    }
    throw 'The livestorm conf file seems broken.'
  }
  

  const { environments, ...livestormConfigWithoutEnvs} = livestormConfig

  let env = environments[envName]

  /**
   * 
   * @type { LivestormEnvironment }
   */
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
    ...livestormConfigWithoutEnvs,
    ...env
  }
}