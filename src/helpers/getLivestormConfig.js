const configStore = require('./configStore.js')
const prompts = require('prompts')
const fs = require('fs')

const livestormDomain = require('./livestormDomain')
const { getLivestormConfig: getRetroLivestormConfig } = require('./retroCompatibility')

/**
 * 
 * @typedef { import('../../types').ExtendedConfig } LivestormExtendedConfig
 * @typedef { import('../../types').Config } LivestormConfig
 */

module.exports = async function getLivestormConfig(envName) {
  /**
   * 
   * @type { LivestormExtendedConfig }
   */
  let livestormExtendedConfig = null
  let noLivestormExtendedConfig = false

  try {
    livestormExtendedConfig = require(`${process.cwd()}/livestorm.config.js`)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      noLivestormExtendedConfig = true
    } else {
      throw 'The livestorm conf file seems broken.'
    }
  }

  // Check the retro Livestorm Config (environments.json)
  if (noLivestormExtendedConfig) {
    if (fs.existsSync(`${process.cwd()}/environments.json`)) {
      /**
       * 
       * @type { LivestormConfig }
       */
      const retroLivestormConfig = getRetroLivestormConfig(envName)
  
      if (retroLivestormConfig) {
        console.warn('Environments.json is deprecated. Please use livestorm.config.js instead.')
        return retroLivestormConfig
      }
    } else {
      throw 'The livestorm conf file is missing.'
    }
  }

  const { environments, ...livestormConfig } = livestormExtendedConfig

  if (envName) {

    let envConfig = environments?.[envName]

    /**
     * 
     * @type { LivestormConfig }
     */
    const globalEnvConfig = configStore.get(`envs.${envName}`)

    /**
     * 
     * @type { ('local' | 'global') }
     */
    let selectedEnvConf

    if (envConfig && globalEnvConfig) {
      const answser = await prompts({
        type: 'select',
        name: 'selectedEnvConf',
        message: `We have found 2 configurations for ${envName}. Select the one you want to use`,
        choices: [
          { title: 'Local', value: 'local' },
          { title: 'Global', value: 'global' },
        ],
        initial: 1

      })

      selectedEnvConf = answser.selectedEnvConf
    }

    if (selectedEnvConf === 'global' || (!envConfig && globalEnvConfig)) {
      envConfig = {
        ...envConfig,
        ...globalEnvConfig,
      }
    }

    if (!envConfig) {
      throw `There is no configuration for the environment ${envName}. Please a conf under the key "${envName}".`
    }

    if (envConfig['api-token']) {
      envConfig.apiToken = envConfig['api-token']
      delete envConfig['api-token']
    }

    Object.assign(livestormConfig, envConfig)  
  }

  livestormConfig.endpoint ||= livestormDomain

  if (!livestormConfig.name) {
    throw `The name is missing.`
  }

  if (!livestormConfig.apiToken) {
    throw `The API Token is missing.`
  }

  return livestormConfig
}
