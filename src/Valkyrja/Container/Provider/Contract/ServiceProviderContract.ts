import type { ContainerContract } from '../../Manager/Contract/ContainerContract.js';

export interface ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void>;
}

export namespace ServiceProviderContract {
    export function instanceOf(value: unknown): value is ServiceProviderContract {
        return typeof value === 'object' && value !== null && 'publishers' in value;
    }
}
