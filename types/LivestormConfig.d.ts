export type Environment =  {
    endpoint: string;
    apiToken: string;
} & Omit<Config, 'environments'>

export interface Config {
    name: string;
    metadata: string;
    permissions: [];
    recorded: boolean;
    environments: { [envName: string]: Environment };
}