import { Container } from './Container.js';

import type { ContainerData } from '../Data/ContainerData.js';
import type { ContainerContract } from './Contract/ContainerContract.js';

export class ChildContainer extends Container {
    constructor(
        protected parent: ContainerContract,
        data: ContainerData,
    ) {
        super();

        this.singletons = { ...data.singletons };
        this.deferredCallback = { ...data.deferredCallback };
    }

    override isAlias(id: string): boolean {
        return super.isAlias(id) || this.parent.isAlias(id);
    }

    override isService(id: string): boolean {
        return super.isService(id) || this.parent.isService(id);
    }

    override isSingletonInstance(id: string): boolean {
        return super.isSingletonInstance(id) || this.parent.isSingletonInstance(id);
    }

    override isDeferred(id: string): boolean {
        return super.isDeferred(id) || this.parent.isDeferred(id);
    }

    override isPublished(id: string): boolean {
        return super.isPublished(id) || this.parent.isPublished(id);
    }

    protected override getSingletonWithoutChecks<T extends object>(id: string): T | undefined {
        if (!super.isSingletonInstance(id) && this.parent.isSingletonInstance(id)) {
            return this.parent.getSingleton<T>(id);
        }

        return super.getSingletonWithoutChecks<T>(id);
    }

    protected override getServiceWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        if (!super.isService(id) && this.parent.isService(id)) {
            return this.parent.getService<T>(id, args);
        }

        return super.getServiceWithoutChecks<T>(id, args);
    }

    protected override getAliasedWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        if (!super.isAlias(id) && this.parent.isAlias(id)) {
            return this.parent.getAliased<T>(id, args);
        }

        return super.getAliasedWithoutChecks<T>(id, args);
    }
}
