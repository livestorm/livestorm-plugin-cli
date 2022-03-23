import configStore from 'configstore'
import envs from '../../../src/cmds/envs'

jest.mock('../../../src/cmds/upgrade')
jest.mock('configstore')

const mockedConfigstore = jest.mocked(configStore, true)

describe('Remove command', () => {
    const envName = 'boron'
    envs({
        _: ['remove', envName]
    })

    it('should call correctly the config store to delete an entry', () => {
        const deleteFn = mockedConfigstore.mock.instances[0].delete as jest.Mock
        expect(deleteFn).toHaveBeenCalled()

        const [ key ] = deleteFn.mock.calls[0]
        expect(key).toBe(`envs.${envName}`)
    });
})
