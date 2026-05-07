import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';

export interface PublishableComponentProviderContract {
    publish(app: ApplicationContract): void;
}