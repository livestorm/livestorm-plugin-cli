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
            throw `The environment '${envName}' has not been found in the environments.json file. We suggest you to create a livestorm.config.js file instead to be able to fully use the new environments manager: https://developers.livestorm.co/docs/managing-environments`
        }

        if (!foundEnv.endpoint) {
            foundEnv.endpoint = livestormDomain   
        }

        console.log('Environments.json will not longer be maintained soon. Please use livestorm.config.js instead.')

        return foundEnv
    }
}
