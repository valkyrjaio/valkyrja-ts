import type { ServiceProviderContract } from '../../Provider/Contract/ServiceProviderContract.js';

export interface ProvidersAwareContract {
    register(provider: ServiceProviderContract): void;
    isDeferred(id: string): boolean;
    isPublished(id: string): boolean;
    publish(id: string): void;
}
