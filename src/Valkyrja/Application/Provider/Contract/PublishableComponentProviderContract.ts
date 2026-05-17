import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';

export interface PublishableComponentProviderContract {
    publish(app: ApplicationContract): void;
}

export namespace PublishableComponentProviderContract {
    export function instanceOf(value: unknown): value is PublishableComponentProviderContract {
        return typeof value === 'object' && value !== null && 'publish' in value;
    }
}
