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
    'api-token': "fromConfigStoreApiToken",
    'endpoint': 'fromConfigStoreEndpoint'
}

const withEnv = {
    ...baseConfig,
    environments: {
       fakeEnv: {
        'apiToken': "withEnvEndpointApiToken",
        'endpoint': 'withEnvEndpoint',
        'recorded': true
       }
    }
}

export {
    fromConfigStore,
    withEnv
}