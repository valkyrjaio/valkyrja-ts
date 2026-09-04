/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerData } from '../Data/ContainerData.ts';
import { ContainerCyclicAliasException } from '../Throwable/Exception/ContainerCyclicAliasException.ts';
import { ContainerInvalidReferenceException } from '../Throwable/Exception/ContainerInvalidReferenceException.ts';
import { ContainerInvalidPublishCallbackException } from '../Throwable/Exception/ContainerInvalidPublishCallbackException.ts';

import type { ServiceProviderContract } from '../Provider/Contract/ServiceProviderContract.ts';
import type { ContainerContract } from './Contract/ContainerContract.ts';

export class Container implements ContainerContract {
    protected aliases: Record<string, string> = {};
    protected instances: Record<string, object> = {};
    protected services: Record<string, (container: ContainerContract, args?: unknown[]) => object> = {};
    protected singletons: Record<string, string> = {};
    protected deferredCallback: Record<string, (container: ContainerContract) => void> = {};
    protected published: Record<string, boolean> = {};

    constructor(data: ContainerData = new ContainerData()) {
        this.aliases = { ...data.aliases };
        this.deferredCallback = { ...data.deferredCallback };
        this.services = { ...data.services };
        this.singletons = { ...data.singletons };

        this.validateAliasesAreNotCyclic();
    }

    getData(): ContainerData {
        return new ContainerData({
            aliases: { ...this.aliases },
            deferredCallback: { ...this.deferredCallback },
            services: { ...this.services },
            singletons: { ...this.singletons },
        });
    }

    setFromData(data: ContainerData): void {
        this.aliases = { ...this.aliases, ...data.aliases };
        this.deferredCallback = { ...this.deferredCallback, ...data.deferredCallback };
        this.services = { ...this.services, ...data.services };
        this.singletons = { ...this.singletons, ...data.singletons };

        this.validateAliasesAreNotCyclic();
    }

    has(id: string): boolean {
        return this.isDeferred(id) || this.isSingleton(id) || this.isService(id) || this.isAlias(id);
    }

    bind<T extends object>(id: string, factory: (container: ContainerContract, args?: unknown[]) => T): this {
        this.services[id] = factory;
        this.published[id] = true;

        return this;
    }

    bindAlias(alias: string, id: string): this {
        this.validateAliasIsNotCyclic(alias, id);

        this.aliases[alias] = id;

        return this;
    }

    /**
     * Validate that an alias does not point at a chain that returns to it.
     */
    protected validateAliasIsNotCyclic(alias: string, id: string): void {
        if (alias === id) {
            throw new ContainerCyclicAliasException(alias, id);
        }

        const seen = new Set<string>();
        let current = id;
        let aliasedId = this.getAliasedId(current);

        while (aliasedId !== undefined) {
            if (aliasedId === alias) {
                throw new ContainerCyclicAliasException(alias, id);
            }

            // A cycle this alias is no part of would spin here. The sweep below reaches
            // every alias, so the walk that starts inside that cycle throws for it.
            if (seen.has(aliasedId)) {
                return;
            }

            seen.add(aliasedId);
            current = aliasedId;
            aliasedId = this.getAliasedId(current);
        }
    }

    /**
     * Validate that no alias in the map points at a chain that returns to it.
     */
    protected validateAliasesAreNotCyclic(): void {
        for (const [alias, id] of Object.entries(this.aliases)) {
            this.validateAliasIsNotCyclic(alias, id);
        }
    }

    bindSingleton<T extends object>(id: string, factory: (container: ContainerContract, args?: unknown[]) => T): this {
        this.singletons[id] = id;
        this.bind(id, factory);

        return this;
    }

    setSingleton<T extends object>(id: string, singleton: T): this {
        this.instances[id] = singleton;
        this.published[id] = true;

        return this;
    }

    isAlias(id: string): boolean {
        return id in this.aliases;
    }

    isService(id: string): boolean {
        return id in this.services;
    }

    isSingleton(id: string): boolean {
        return this.isSingletonBinding(id) || this.isSingletonInstance(id);
    }

    isSingletonBinding(id: string): boolean {
        return id in this.singletons;
    }

    isSingletonInstance(id: string): boolean {
        return id in this.instances;
    }

    get<T extends object>(id: string, args: unknown[] = []): T {
        this.publishUnpublishedProvided(id);

        return (
            this.getSingletonWithoutChecks<T>(id) ??
            this.getServiceWithoutChecks<T>(id, args) ??
            this.getAliasedWithoutChecks<T>(id, args) ??
            (() => {
                throw new ContainerInvalidReferenceException(id);
            })()
        );
    }

    getAliased<T extends object>(id: string, args: unknown[] = []): T {
        return (
            this.getAliasedWithoutChecks<T>(id, args) ??
            (() => {
                throw new ContainerInvalidReferenceException(id);
            })()
        );
    }

    getService<T extends object>(id: string, args: unknown[] = []): T {
        this.publishUnpublishedProvided(id);

        return (
            this.getServiceWithoutChecks<T>(id, args) ??
            (() => {
                throw new ContainerInvalidReferenceException(id);
            })()
        );
    }

    getSingleton<T extends object>(id: string): T {
        this.publishUnpublishedProvided(id);

        return (
            this.getSingletonWithoutChecks<T>(id) ??
            (() => {
                throw new ContainerInvalidReferenceException(id);
            })()
        );
    }

    register(provider: ServiceProviderContract): void {
        for (const [id, callback] of Object.entries(provider.publishers())) {
            if (typeof callback !== 'function') {
                throw new ContainerInvalidPublishCallbackException(`${id} should have a valid callable`);
            }

            this.deferredCallback[id] = callback;
        }
    }

    isDeferred(id: string): boolean {
        return id in this.deferredCallback;
    }

    isPublished(id: string): boolean {
        return id in this.published;
    }

    publish(id: string): void {
        const publishCallback = this.getDeferredCallback(id);

        if (publishCallback === undefined) {
            return;
        }

        publishCallback(this);
        this.published[id] = true;
    }

    protected getAliasedWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        const aliased = this.getAliasedId(id);

        if (aliased === undefined) {
            return undefined;
        }

        return this.get<T>(aliased, args);
    }

    protected getSingletonWithoutChecks<T extends object>(id: string): T | undefined {
        const instance = this.getSingletonInstance<T>(id);

        if (instance !== undefined) {
            return instance;
        }

        if (!this.isSingletonBinding(id)) {
            return undefined;
        }

        const singleton = this.getServiceWithoutChecks<T>(id);

        if (singleton !== undefined) {
            this.instances[id] = singleton;
        }

        return singleton;
    }

    protected getServiceWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
        const factory = this.getServiceCallable(id);

        if (factory === undefined) {
            return undefined;
        }

        return factory(this, args) as T;
    }

    getAliasedId(alias: string): string | undefined {
        return this.aliases[alias];
    }

    protected getSingletonInstance<T extends object>(id: string): T | undefined {
        return this.instances[id] as T | undefined;
    }

    protected getServiceCallable(id: string): ((container: ContainerContract, args?: unknown[]) => object) | undefined {
        return this.services[id];
    }

    protected getDeferredCallback(id: string): ((container: ContainerContract) => void) | undefined {
        return this.deferredCallback[id];
    }

    protected publishUnpublishedProvided(id: string): void {
        if (this.isDeferred(id) && !this.isPublished(id)) {
            this.publish(id);
        }
    }
}
