import type { ServiceProviderConstructor } from '../../Provider/Contract/ServiceProviderContract.js';

export interface ProvidersAwareContract {
    register(provider: ServiceProviderConstructor): void;
    isDeferred(id: string): boolean;
    isPublished(id: string): boolean;
    isRegistered(provider: ServiceProviderConstructor): boolean;
    publish(id: string): void;
}