import os from 'os'
import process from 'process'
import { v4 as uuidv4 } from 'uuid';

import getLivestormConfig from '../../src/helpers/getLivestormConfig'
import livestormDomain from '../../src/helpers/livestormDomain'

import baseConfig, { withEnv } from '../fixtures/configs'

enum ConfigFileSources {
    LivestormConfig = "livestorm.config.js",
    Environments = "environments.json",
}

const fsify = require('fsify')({
    cwd: os.tmpdir(),
    persistent: false,
    force: true
})

let spy = jest.spyOn(process, 'cwd');
let directory

const writeConfigFile = async (config: any, source = ConfigFileSources.LivestormConfig) => {
    const contents = [
        {
            type: fsify.FILE,
            name: source,
            contents: source === ConfigFileSources.LivestormConfig ? `module.exports = ${JSON.stringify(config)}` : JSON.stringify(config)
        },
    ]

    if (source === ConfigFileSources.Environments) {
        contents.push({
            type: fsify.FILE,
            // @ts-ignore
            name: 'package.json',
            contents: '{}'
        })
    }
    const structure = [
        {
            type: fsify.DIRECTORY,
            name: directory,
            contents,
        }
    ]

    await fsify(structure)
}

beforeEach(() => {
    directory = uuidv4()
    spy.mockReturnValue(os.tmpdir() + '/' + directory);
})

describe('The helper to get the livestorm config', () => {
    describe('from the the livestorm.config.js file', () => {
        it('should return a simple config by default', async () => {
            await writeConfigFile(baseConfig)
            const config = await getLivestormConfig()
            expect(config).toStrictEqual({
                ...baseConfig,
                endpoint: livestormDomain
            })
        })

        it('should return the conf from the set environment', async () => {
            await writeConfigFile(withEnv)
            const config = await getLivestormConfig('fakeEnv')
            expect(config).toStrictEqual({
                ...baseConfig,
                ...withEnv['environments'].fakeEnv
            })
        })

        it('should return an error when no config file', async () => {
            await expect(getLivestormConfig()).rejects.toBe('The livestorm conf file is missing.');
        })

        it('should return an error when no name in the config', async () => {
            await writeConfigFile({ ...baseConfig, name: null })
            await expect(getLivestormConfig()).rejects.toBe('The name is missing.');
        })

        it('should return an error when no API Token in the config', async () => {
            await writeConfigFile({ ...baseConfig, apiToken: null })
            await expect(getLivestormConfig()).rejects.toBe('The API Token is missing.');
        })
    })

    describe('from the the environments.json file', () => {
        it('should return a simple config by default', async () => {
            const envName = 'development'
            await writeConfigFile({
                [envName]: baseConfig
            }, ConfigFileSources.Environments)
            const config = await getLivestormConfig()
            expect(config).toStrictEqual({
                ...baseConfig,
                endpoint: livestormDomain
            })
        })
    })
})