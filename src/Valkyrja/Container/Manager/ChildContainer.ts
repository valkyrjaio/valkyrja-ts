/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from './Container.ts';

import type { ContainerData } from '../Data/ContainerData.ts';
import type { ContainerContract } from './Contract/ContainerContract.ts';

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

    override getAliasedId(alias: string): string | undefined {
        return super.getAliasedId(alias) ?? this.parent.getAliasedId(alias);
    }

    protected override getAliasedWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        if (super.isAlias(id)) {
            return super.getAliasedWithoutChecks<T>(id, args);
        }

        const aliasedId = this.parent.getAliasedId(id);

        if (aliasedId === undefined) {
            return undefined;
        }

        // The parent holds the target as a singleton it has not built. Resolving it
        // there would build a second copy for a request that already holds the
        // binding, so the child builds its own.
        if (this.parent.isSingletonBinding(aliasedId) && !this.parent.isSingletonInstance(aliasedId)) {
            return this.get<T>(aliasedId, args);
        }

        return this.parent.getAliased<T>(id, args);
    }
}
