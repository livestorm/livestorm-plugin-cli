import configStore from 'configstore'
import envs from '../../../src/cmds/envs'

jest.mock('configstore');

const mockedConfigstore = jest.mocked(configStore, true)

describe('List command', () => {
    envs({
        _: ['list']
    })

    it('should call correctly the config store to get all entries of envs', () => {
        const get = mockedConfigstore.mock.instances[0].get as jest.Mock
        expect(get).toHaveBeenCalled()

        const [ key  ] = get.mock.calls[0]
        expect(key).toBe(`envs`)
    });
})