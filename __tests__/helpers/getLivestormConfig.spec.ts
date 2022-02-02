import os from 'os'
import process from 'process'
import { v4 as uuidv4 } from 'uuid';
import configStore from 'configstore'
import prompts from 'prompts'

import getLivestormConfig from '../../src/helpers/getLivestormConfig'
import livestormDomain from '../../src/helpers/livestormDomain'

import baseConfig, { withEnv, fromConfigStore } from '../fixtures/configs'

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

jest.mock('configstore')
jest.mock('prompts')


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

        it('should retrieve the conf from the config store if exists', async () => {
            const mockedConfigstore = jest.mocked(configStore, true)
            const get = mockedConfigstore.mock.instances[0].get as jest.Mock

            get.mockReturnValue(fromConfigStore)

            await writeConfigFile(baseConfig)
            const config = await getLivestormConfig('fakeEnv')

            expect(get).toHaveBeenCalled()

            const [ key ] = get.mock.calls[0]

            expect(key).toBe(`envs.fakeEnv`)

            expect(config).toStrictEqual({
                ...baseConfig,
                ...fromConfigStore
            })
        })

        it('should retrieve the conf from the config store if global env is selected', async () => {
            const mockedConfigstore = jest.mocked(configStore, true)
            const get = mockedConfigstore.mock.instances[0].get as jest.Mock

            get.mockReturnValue(fromConfigStore)

            const mockedPrompts = jest.mocked(prompts, false)

            mockedPrompts.mockReturnValue(Promise.resolve({
                selectedEnvConf: 'global'
            }))

            await writeConfigFile(withEnv)
            const config = await getLivestormConfig('fakeEnv')

            expect(get).toHaveBeenCalled()

            const [ key ] = get.mock.calls[0]

            expect(key).toBe(`envs.fakeEnv`)

            expect(config).toStrictEqual({
                ...baseConfig,
                ...fromConfigStore
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
            await writeConfigFile({
                development: baseConfig
            }, ConfigFileSources.Environments)
            const config = await getLivestormConfig()
            expect(config).toStrictEqual({
                ...baseConfig,
                endpoint: livestormDomain
            })
        })

        it('should return the env config if set', async () => {
            await writeConfigFile({
                production: baseConfig
            }, ConfigFileSources.Environments)
            const config = await getLivestormConfig('production')
            expect(config).toStrictEqual({
                ...baseConfig,
                endpoint: livestormDomain
            })
        })
    })

    describe('with 2 conf files', () => {
        it('should return the conf from livestorm.config.js', async () => {
            await writeConfigFile({ ...baseConfig, name: 'fromLivestormConfJs' })
            await writeConfigFile({
                development: {
                    ...baseConfig,
                    name: 'fromEnvironmentsJson'
                }
            }, ConfigFileSources.Environments)
            const config = await getLivestormConfig()
            expect(config.name).toBe('fromLivestormConfJs')
        })
    })
})