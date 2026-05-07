import { Container } from './Container.js';

import type { ServiceProviderConstructor } from '../Provider/Contract/ServiceProviderContract.js';
import type { ContainerContract } from './Contract/ContainerContract.js';

export class NativeChildContainer extends Container {
    constructor(protected parent: Container) {
        super();
    }

    override isAlias(id: string): boolean {
        return this.getAlias(id) !== undefined;
    }

    override isService(id: string): boolean {
        return this.getServiceCallable(id) !== undefined;
    }

    override isSingletonBinding(id: string): boolean {
        return (id in this.singletons) || (id in this.parent.singletons);
    }

    override isSingletonInstance(id: string): boolean {
        return (id in this.instances) || (id in this.parent.instances);
    }

    override isDeferred(id: string): boolean {
        return (id in this.deferred)
            || (id in this.deferredCallback)
            || (id in this.parent.deferred)
            || (id in this.parent.deferredCallback);
    }

    override isPublished(id: string): boolean {
        return (id in this.published) || (id in this.parent.published);
    }

    override isRegistered(provider: ServiceProviderConstructor): boolean {
        return this.registered.has(provider) || this.parent.registered.has(provider);
    }

    protected override getDeferredCallback(id: string): ((container: ContainerContract) => void) | undefined {
        return this.deferredCallback[id] ?? this.parent.deferredCallback[id];
    }

    protected override getAlias(id: string): string | undefined {
        return this.aliases[id] ?? this.parent.aliases[id];
    }

    protected override getSingletonInstance<T extends object>(id: string): T | undefined {
        return (this.instances[id] ?? this.parent.instances[id]) as T | undefined;
    }

    protected override getServiceCallable(id: string): ((container: ContainerContract, args?: unknown[]) => object) | undefined {
        return this.services[id] ?? this.parent.services[id];
    }
}