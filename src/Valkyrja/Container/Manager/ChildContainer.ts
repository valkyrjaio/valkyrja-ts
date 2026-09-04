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

    override isSingletonBinding(id: string): boolean {
        return super.isSingletonBinding(id) || this.parent.isSingletonBinding(id);
    }

    override isSingletonInstance(id: string): boolean {
        return super.isSingletonInstance(id) || this.parent.isSingletonInstance(id);
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

        const target = this.getParentAliasTarget(id);

        if (target === undefined) {
            return undefined;
        }

        // The parent would resolve this target for the first time, and the child holds
        // the same registration, so letting the parent do it would leave the request
        // with one copy for the alias and another for the id.
        if (this.isUnbuiltInParent(target)) {
            return this.get<T>(target, args);
        }

        return this.parent.getAliased<T>(id, args);
    }

    /**
     * Walk the parent's chain of aliases to the id the parent would answer.
     */
    protected getParentAliasTarget(id: string): string | undefined {
        let current = id;
        let target: string | undefined;
        let aliasedId = this.parent.getAliasedId(current);

        while (aliasedId !== undefined) {
            target = aliasedId;
            current = aliasedId;

            // The parent publishes, then reads its maps, and only then follows an
            // alias, so it never reaches the rest of the chain from any of these.
            if (this.parent.isDeferred(current) || this.parent.isSingleton(current) || this.parent.isService(current)) {
                break;
            }

            aliasedId = this.parent.getAliasedId(current);
        }

        return target;
    }

    /**
     * Check whether the parent would resolve an id for the first time.
     */
    protected isUnbuiltInParent(id: string): boolean {
        // The parent publishes before it reads any map, so this test comes first.
        if (this.parent.isDeferred(id) && !this.parent.isPublished(id)) {
            return true;
        }

        if (this.parent.isSingletonInstance(id)) {
            return false;
        }

        return this.parent.isSingletonBinding(id);
    }
}
