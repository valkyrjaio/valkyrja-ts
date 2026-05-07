import type { ContainerContract } from '../Manager/Contract/ContainerContract.js';
import type { ServiceProviderConstructor } from '../Provider/Contract/ServiceProviderContract.js';

export class ContainerData {
    readonly aliases: Record<string, string>;
    readonly deferred: Record<string, ServiceProviderConstructor>;
    readonly deferredCallback: Record<string, (container: ContainerContract) => void>;
    readonly services: Record<string, (container: ContainerContract, args?: unknown[]) => object>;
    readonly singletons: Record<string, string>;
    readonly providers: ServiceProviderConstructor[];

    constructor(data: {
        aliases?: Record<string, string>;
        deferred?: Record<string, ServiceProviderConstructor>;
        deferredCallback?: Record<string, (container: ContainerContract) => void>;
        services?: Record<string, (container: ContainerContract, args?: unknown[]) => object>;
        singletons?: Record<string, string>;
        providers?: ServiceProviderConstructor[];
    } = {}) {
        this.aliases          = data.aliases          ?? {};
        this.deferred         = data.deferred         ?? {};
        this.deferredCallback = data.deferredCallback ?? {};
        this.services         = data.services         ?? {};
        this.singletons       = data.singletons       ?? {};
        this.providers        = data.providers        ?? [];
    }
}