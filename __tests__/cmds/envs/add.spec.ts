import configStore from 'configstore'
import envs from '../../../src/cmds/envs'

import { fromEnvsAddCmd } from '../../fixtures/configs'

const makeOutput = config => {
    const output = {
        ...config
    }

    // @ts-ignore
    output.apiToken = config['api-token']
    delete output['api-token']

    return output
}

jest.mock('configstore');
const mockedConfigstore = jest.mocked(configStore, true)

it('should call correctly the config store to set an entry', () => {
    const set = mockedConfigstore.mock.instances[0].set as jest.Mock
    envs({
        _: ['add', 'env1'],
        ...fromEnvsAddCmd
    })
    expect(set).toHaveBeenCalledTimes(1)

    expect(set.mock.calls[0][0]).toBe(`envs.env1`)
    expect(set.mock.calls[0][1]).toStrictEqual(makeOutput(fromEnvsAddCmd))

    // With --api-token only
    envs({
        _: ['add', 'env2'],
        'api-token': fromEnvsAddCmd['api-token']
    })

    expect(set).toHaveBeenCalledTimes(2)
    expect(set.mock.calls[1][0]).toBe(`envs.env2`)
    expect(set.mock.calls[1][1]).toStrictEqual(makeOutput({ 'api-token': fromEnvsAddCmd['api-token'] }))
});
