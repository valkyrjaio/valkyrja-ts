import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../../Provider/Contract/ComponentProviderContract.js';

export interface ConfigContract {
    readonly namespace: string;
    readonly dir: string;
    readonly version: string;
    readonly environment: string;
    readonly debugMode: boolean;
    readonly timezone: string;
    readonly key: string;
    readonly dataPath: string;
    readonly dataNamespace: string;
    readonly providers: ComponentProviderContract[];
    readonly callbacks: ((app: ApplicationContract) => void)[];
}

export namespace ConfigContract {
    export function instanceOf(value: unknown): value is ConfigContract {
        return typeof value === 'object' && value !== null && 'namespace' in value;
    }
}
