/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerCyclicAliasException } from '../Throwable/Exception/ContainerCyclicAliasException.ts';
import { Container } from './Container.ts';

import type { ContainerData } from '../Data/ContainerData.ts';
import type { ContainerContract } from './Contract/ContainerContract.ts';

export class ChildContainer extends Container {
    /** The alias targets this container is resolving. */
    protected targetsInFlight = new Set<string>();

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
        if (this.resolvesInChild(target)) {
            return this.getTargetOnce<T>(id, target, args);
        }

        return this.parent.getAliased<T>(id, args);
    }

    /**
     * Resolve an alias target, and reject a chain that returns to one already in flight.
     */
    protected getTargetOnce<T extends object>(id: string, target: string, args: unknown[]): T {
        // A walk ends at the first hop the parent would answer, so a chain that closes
        // across two of them returns here rather than to one walk. A factory that
        // registered its own id while it runs has broken the chain, so read that first,
        // and name the pair only when nothing can answer.
        if (this.targetsInFlight.has(target)) {
            const registered = this.getSingletonInstance<T>(target);

            if (registered !== undefined) {
                return registered;
            }

            throw new ContainerCyclicAliasException(id, target);
        }

        this.targetsInFlight.add(target);

        try {
            return this.get<T>(target, args);
        } finally {
            this.targetsInFlight.delete(target);
        }
    }

    /**
     * Walk the parent's chain of aliases to the id the parent would answer.
     */
    protected getParentAliasTarget(id: string): string | undefined {
        let current = id;
        let target: string | undefined;
        let aliasedId = this.parent.getAliasedId(current);
        const seen = new Set<string>([id]);

        while (aliasedId !== undefined) {
            // A parent that is itself a child reads its own map and its parent's, and a
            // binding made on either after it was built can close a chain between them.
            if (seen.has(aliasedId)) {
                throw new ContainerCyclicAliasException(current, aliasedId);
            }

            seen.add(aliasedId);
            target = aliasedId;
            current = aliasedId;

            // The parent publishes, then reads its maps, and only then follows an
            // alias, so it never reaches the rest of the chain from any of these.
            if (
                (this.parent.isDeferred(current) && !this.parent.isPublished(current)) ||
                this.parent.isSingleton(current) ||
                this.parent.isService(current)
            ) {
                break;
            }

            aliasedId = this.parent.getAliasedId(current);
        }

        return target;
    }

    /**
     * Check whether the child resolves the target of a parent-declared alias itself.
     */
    protected resolvesInChild(id: string): boolean {
        // The parent publishes before it reads any map, so this test comes first. Both
        // containers answer it: the parent's state is what makes this a target it would
        // publish for the first time, and the child's callback is what lets the child
        // publish it instead.
        if (this.parent.isDeferred(id) && !this.parent.isPublished(id) && this.isDeferred(id)) {
            return true;
        }

        if (this.parent.isSingletonInstance(id)) {
            return false;
        }

        // Both containers answer here. The parent's marker is what makes this a target the
        // parent would build for the first time, and the child's is what lets the child
        // cache what it builds instead.
        return this.parent.isSingletonBinding(id) && this.isSingletonBinding(id);
    }
}
