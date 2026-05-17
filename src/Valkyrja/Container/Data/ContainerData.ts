import type { ContainerContract } from '../Manager/Contract/ContainerContract.js';

export class ContainerData {
    readonly aliases: Record<string, string>;
    readonly deferredCallback: Record<string, (container: ContainerContract) => void>;
    readonly services: Record<string, (container: ContainerContract, args?: unknown[]) => object>;
    readonly singletons: Record<string, string>;

    constructor(
        data: {
            aliases?: Record<string, string>;
            deferredCallback?: Record<string, (container: ContainerContract) => void>;
            services?: Record<string, (container: ContainerContract, args?: unknown[]) => object>;
            singletons?: Record<string, string>;
        } = {},
    ) {
        this.aliases = data.aliases ?? {};
        this.deferredCallback = data.deferredCallback ?? {};
        this.services = data.services ?? {};
        this.singletons = data.singletons ?? {};
    }
}
