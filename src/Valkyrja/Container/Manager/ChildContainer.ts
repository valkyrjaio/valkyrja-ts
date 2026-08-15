/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerInvalidReferenceException } from '../Throwable/Exception/ContainerInvalidReferenceException.ts';
import { ContainerUnpublishedParentTargetException } from '../Throwable/Exception/ContainerUnpublishedParentTargetException.ts';
import { ContainerUnresolvedParentAliasException } from '../Throwable/Exception/ContainerUnresolvedParentAliasException.ts';
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

    protected override getSingletonWithoutChecks<T extends object>(id: string): T | undefined {
        if (!super.isSingletonInstance(id) && this.parent.isSingletonInstance(id)) {
            if (this.isUnpublishedInParent(id)) {
                // Delegating would run the parent's publish callback, so answer from
                // the child instead.
                const instance = super.getSingletonWithoutChecks<T>(id);

                if (instance !== undefined) {
                    return instance;
                }

                // get() tries the child's service and alias maps after this, and
                // getSingleton() does not, so refuse only when neither can answer.
                if (super.isService(id) || super.isAlias(id)) {
                    return undefined;
                }

                throw new ContainerUnpublishedParentTargetException(id);
            }

            return this.parent.getSingleton<T>(id);
        }

        return super.getSingletonWithoutChecks<T>(id);
    }

    protected override getServiceWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        if (!super.isService(id) && this.parent.isService(id)) {
            if (this.isUnpublishedInParent(id)) {
                // get() tries the child's alias map after this, and getService()
                // does not, so refuse only when that cannot answer either.
                if (super.isAlias(id)) {
                    return undefined;
                }

                throw new ContainerUnpublishedParentTargetException(id);
            }

            return this.parent.getService<T>(id, args);
        }

        return super.getServiceWithoutChecks<T>(id, args);
    }

    protected override getAliasedWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        if (super.isAlias(id)) {
            return super.getAliasedWithoutChecks<T>(id, args);
        }

        if (!this.parent.isAlias(id)) {
            return undefined;
        }

        this.validateParentAliasResolution(id);

        return this.parent.getAliased<T>(id, args);
    }

    /**
     * Check whether the parent holds a publish callback it has not run.
     */
    protected isUnpublishedInParent(id: string): boolean {
        return this.parent.isDeferred(id) && !this.parent.isPublished(id);
    }

    /**
     * Validate that the parent answers an alias without caching anything new.
     */
    protected validateParentAliasResolution(id: string): void {
        const seen = new Set<string>();
        let current = id;
        let aliasedId = this.parent.getAliasedId(current);

        while (aliasedId !== undefined) {
            if (seen.has(aliasedId)) {
                throw new ContainerInvalidReferenceException(id);
            }

            seen.add(aliasedId);
            current = aliasedId;

            if (this.isUnresolvedInParent(current)) {
                throw new ContainerUnresolvedParentAliasException(id, current);
            }

            // The parent answers a singleton or a service before it follows an
            // alias, so it never reaches the rest of the chain.
            if (this.parent.isSingletonInstance(current) || this.parent.isService(current)) {
                return;
            }

            aliasedId = this.parent.getAliasedId(current);
        }
    }

    /**
     * Check whether the parent would cache a given id for the first time.
     */
    protected isUnresolvedInParent(id: string): boolean {
        // The parent publishes before it reads any map, so this test comes first.
        if (this.isUnpublishedInParent(id)) {
            return true;
        }

        if (this.parent.isSingletonInstance(id)) {
            return false;
        }

        return this.parent.isSingletonBinding(id);
    }
}
