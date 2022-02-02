const baseConfig = {
    "name": "fake-plugin",
    'apiToken': "f2526bba-82b5-11ec-a8a3-0242ac120002",
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
    ...baseConfig,
    apiToken: undefined,
    'api-token': baseConfig.apiToken
}
delete fromConfigStore.apiToken
delete fromConfigStore.name

const withEnv = {
    ...baseConfig,
    environments: {
       fakeEnv: {
        'apiToken': "f2526bba-82b5-11ec-a8a3-0242ac120002",
        'endpoint': 'endpoint.fake'
       }
    }
}

export {
    fromConfigStore,
    withEnv
}