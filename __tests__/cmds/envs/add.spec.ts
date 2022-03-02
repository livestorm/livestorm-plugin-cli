import configStore from 'configstore'
import envs from '../../../src/cmds/envs'

import { fromEnvsAddCmd } from '../../fixtures/configs'

jest.mock('configstore');

const mockedConfigstore = jest.mocked(configStore, true)

describe('Add command', () => {
    const envName = 'boron'
    const set = mockedConfigstore.mock.instances[0].set as jest.Mock
    envs({
        _: ['add', envName],
        ...fromEnvsAddCmd
    })

    it('should call correctly the config store to set an entry', () => {
        expect(set).toHaveBeenCalled()

        const [ key, config ] = set.mock.calls[0]

        expect(key).toBe(`envs.${envName}`)

        const output = {
            ...fromEnvsAddCmd
        }

        // @ts-ignore
        output.apiToken = fromEnvsAddCmd['api-token']
        delete output['api-token']
        expect(config).toStrictEqual(output)
    });

    it('should update correctly an entry in the config store ', () => {
        const dataTopdate = {
            ...fromEnvsAddCmd,
            endpoint: 'https://endpoint.fake'
        }
        envs({
            _: ['add', envName],
            ...dataTopdate
        })

        const [ key, config ] = set.mock.calls[1]

        expect(key).toBe(`envs.${envName}`)

        const output = {
            ...fromEnvsAddCmd,
            ...dataTopdate
        }

        // @ts-ignore
        output.apiToken = fromEnvsAddCmd['api-token']
        delete output['api-token']
        expect(config).toStrictEqual(output)
    });
})