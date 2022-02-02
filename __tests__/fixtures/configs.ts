const baseConfig = {
    "name": "baseConfigName",
    'apiToken': "baseConfigApiToken",
    "permissions": {
        "storage": {
            "fake-property": {
                "write": ["teamMembers"]
            }
        }
    },
    "metadata": {
        "logo": "https://fakelogo.png",
        "translations": {
            "title": {
                "en": "Fake plugin",
                "fr": "Fake plugin",
                "es": "Fake plugin"
            },
            "description": {
                "en": "This is a fake plugin",
                "fr": "Ceci n'est pas un plugin",
                "es": "No es un plugin"
            }
        }
    },
    'recorded': true,
}

export default baseConfig

const fromConfigStore = {
    'apiToken': "fromConfigStoreApiToken",
    'endpoint': 'fromConfigStoreEndpoint',
    'recorded': false
}

const fromEnvsAddCmd = {
    'api-token': "fromEnvsAddCmdApiToken",
    'endpoint': 'fromEnvsAddCmdEndpoint',
    'recorded': false
}

const withEnv = {
    ...baseConfig,
    environments: {
       fakeEnv: {
        'apiToken': "withEnvEndpointApiToken",
        'endpoint': 'withEnvEndpoint',
       }
    }
}

export {
    fromConfigStore,
    fromEnvsAddCmd,
    withEnv
}