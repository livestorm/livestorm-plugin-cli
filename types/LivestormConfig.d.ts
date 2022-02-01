import { Translatable } from './Translatable'

type Metadata = {
    logo: string;
    translations: {
        title: Translatable,
        description: Translatable
    }
}

type Permissions = {
    [api: string]: {
        [apiKey: string]: {
            [permission: string]: ['teamMembers']
        }
    }
}
export default interface Config {
    name: string;
    apiToken: string;
    metadata: Metadata;
    endpoint?: string;
    permissions?: Permissions;
    recorded?: boolean;
}
export type ExtendedConfig = Config & {
    environments: { [envName: string]: Config}
}