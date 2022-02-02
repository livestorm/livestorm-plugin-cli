module.exports = {
    getLivestormConfig: function (envName = 'development') {
        const config =  require(`${process.cwd()}/environments.json`)

        if (envName === 'development' && !config[envName] && (config.apiToken || config.apiKey)) {
            foundEnv = config
        } else if (config[envName]) {
            foundEnv = config[envName]
        } else {
            throw `There is no configuration for the environment ${envName}. Please a conf under the key "${envName}".`
        }

        return foundEnv
    }
}