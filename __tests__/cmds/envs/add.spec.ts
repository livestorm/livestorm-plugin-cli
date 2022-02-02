import configStore from 'configstore'
import envs from '../../../src/cmds/envs'

import { fromConfigStore } from '../../fixtures/configs'

jest.mock('configstore');

const mockedConfigstore = jest.mocked(configStore, true)

describe('Add command', () => {
    const [ envName, data ] = ['boron', fromConfigStore]
    envs({
        _: ['add', envName],
        ...data
    })
    const set = mockedConfigstore.mock.instances[0].set as jest.Mock

    it('should call correctly the config store to set an entry', () => {
        expect(set).toHaveBeenCalled()

        const [ key, config ] = set.mock.calls[0]

        expect(key).toBe(`envs.${envName}`)
        expect(config).toStrictEqual(data)
    });

    it('should update correctly an entry in the config store ', () => {
        const dataTopdate = {
            ...data,
            endpoint: 'https://endpoint.fake'
        }
        envs({
            _: ['add', envName],
            ...dataTopdate
        })

        const [ key, config ] = set.mock.calls[1]

        expect(key).toBe(`envs.${envName}`)
        expect(config).toStrictEqual(dataTopdate)
    });
})