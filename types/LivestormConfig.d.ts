import { Translatable } from './Translatable'

export type Environment = {
    endpoint: string;
    apiToken: string;
} & Omit<Config, 'environments'>

export type Metadata = {
    logo: string;
    translations: {
        title: Translatable,
        description: Translatable
    }
}

export interface Config {
    name: string;
    metadata: Metadata;
    permissions: [];
    recorded: boolean;
    environments: { [envName: string]: Environment };
}