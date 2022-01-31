import configStore from 'configstore'
import envs from '../../../src/cmds/envs'

import { environment } from '../../fixtures/environments'

jest.mock('configstore');

const mockedConfigstore = jest.mocked(configStore, true)

describe('Add command', () => {
    const [ envName, data ] = environment
    envs({
        _: ['add', envName],
        ...data
    })

    it('should call correctly the config store to set an entry', () => {
        const set = mockedConfigstore.mock.instances[0].set as jest.Mock
        expect(set).toHaveBeenCalled()

        const [ key, env ] = set.mock.calls[0]

        expect(key).toBe(`envs.${envName}`)
        expect(env).toStrictEqual(data)
    });
})