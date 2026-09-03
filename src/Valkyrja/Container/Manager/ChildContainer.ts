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

    override getAliasedId(alias: string): string | undefined {
        return super.getAliasedId(alias) ?? this.parent.getAliasedId(alias);
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

    override getSingletonInstance<T extends object>(id: string): T | undefined {
        return super.getSingletonInstance<T>(id) ?? this.parent.getSingletonInstance<T>(id);
    }

    override getServiceCallable(id: string): ((container: ContainerContract, args?: unknown[]) => object) | undefined {
        return super.getServiceCallable(id) ?? this.parent.getServiceCallable(id);
    }

    protected override getSingletonWithoutChecks<T extends object>(id: string): T | undefined {
        // The parent holds a resolved instance and the child does not, so the child reuses
        // the parent's copy. The read builds nothing and publishes nothing.
        if (!super.isSingletonInstance(id) && this.parent.isSingletonInstance(id)) {
            return this.parent.getSingletonInstance<T>(id);
        }

        return super.getSingletonWithoutChecks<T>(id);
    }

    protected override getServiceWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        // The parent declares the binding and the child does not, so the child runs the
        // parent's factory with itself as the container. The factory then resolves its own
        // dependencies in the request scope.
        if (super.getServiceCallable(id) === undefined) {
            const callable = this.parent.getServiceCallable(id);

            if (callable !== undefined) {
                return callable(this, args) as T;
            }
        }

        return super.getServiceWithoutChecks<T>(id, args);
    }

    protected override getAliasedWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        if (super.isAlias(id)) {
            return super.getAliasedWithoutChecks<T>(id, args);
        }

        const aliasedId = this.getParentAliasTarget(id);

        if (aliasedId === undefined) {
            return undefined;
        }

        return this.getParentAliasedTarget<T>(aliasedId, args);
    }

    /**
     * Walk the parent's alias chain to the first id that resolves.
     */
    protected getParentAliasTarget(id: string): string | undefined {
        const seen = new Set<string>();
        let current = id;
        let aliasedId = this.parent.getAliasedId(current);

        while (aliasedId !== undefined) {
            if (seen.has(aliasedId)) {
                throw new ContainerCyclicAliasException(id, current, aliasedId);
            }

            seen.add(aliasedId);
            current = aliasedId;

            if (this.isResolvable(current)) {
                return current;
            }

            aliasedId = this.parent.getAliasedId(current);
        }

        return undefined;
    }

    /**
     * Resolve the target of an alias that only the parent declares.
     */
    protected getParentAliasedTarget<T extends object>(id: string, args: unknown[] = []): T {
        // The alias belongs to the parent, so it points at the parent's copy first, and at
        // the copy the child built for an earlier lookup second.
        const instance = this.parent.getSingletonInstance<T>(id) ?? super.getSingletonInstance<T>(id);

        if (instance !== undefined) {
            return instance;
        }

        const callable = this.parent.getServiceCallable(id);

        // The parent declares no binding, so the child answers from its own maps.
        if (callable === undefined) {
            return this.get<T>(id, args);
        }

        // The parent's binding runs with the child as the container.
        const built = callable(this, args) as T;

        // A singleton caches in the child, so one request holds one instance.
        if (this.isSingletonBinding(id)) {
            this.instances[id] = built;
        }

        return built;
    }

    /**
     * Check whether an id resolves without a further alias hop.
     */
    protected isResolvable(id: string): boolean {
        return this.isSingleton(id) || this.isService(id) || super.isDeferred(id);
    }
}
