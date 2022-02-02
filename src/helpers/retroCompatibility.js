const livestormDomain = require('./livestormDomain')

module.exports = {
    getLivestormConfig: function (envName = 'development') {
        let json = require(`${process.cwd()}/package.json`)
        let foundEnv = null
        json.livestorm = json.livestorm || require(`${process.cwd()}/environments.json`)

        if (!json.livestorm) {
            throw 'Not a livestorm plugin'
        }

        if (envName === 'development' && !json.livestorm[envName] && (json.livestorm.apiToken || json.livestorm.apiKey)) {
            foundEnv = json.livestorm
        } else if (json.livestorm[envName]) {
            foundEnv = json.livestorm[envName]
        } else {
            throw `There is no configuration for the environment ${envName}. Please a conf under the key "${envName}".`
        }

        foundEnv.endpoint ||= livestormDomain

        console.log('Environments.json is log. Please use livestorm.config.js instead.')

        return foundEnv
    }
}