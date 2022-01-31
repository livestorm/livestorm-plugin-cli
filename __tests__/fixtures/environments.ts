export const environment = ['boron', {
        'apiToken': "f2526bba-82b5-11ec-a8a3-0242ac120002",
        'endpoint': 'https://plugins.livestorm.fake',
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
] as const