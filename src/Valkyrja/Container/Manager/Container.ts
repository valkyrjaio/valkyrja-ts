import { ContainerData } from '../Data/ContainerData.js';
import { InvalidReferenceMode } from '../Enum/InvalidReferenceMode.js';
import { ContainerInvalidReferenceException } from '../Throwable/Exception/ContainerInvalidReferenceException.js';
import { ContainerInvalidPublishCallbackException } from '../Throwable/Exception/ContainerInvalidPublishCallbackException.js';

import type { ServiceProviderContract } from '../Provider/Contract/ServiceProviderContract.js';
import type { ContainerContract } from './Contract/ContainerContract.js';

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
        this.aliases[alias] = id;

        return this;
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

    get<T extends object>(
        id: string,
        args: unknown[] = [],
        mode: InvalidReferenceMode = InvalidReferenceMode.NEW_INSTANCE_OR_THROW_EXCEPTION,
    ): T {
        this.publishUnpublishedProvided(id);

        return (
            this.getSingletonWithoutChecks<T>(id) ??
            this.getServiceWithoutChecks<T>(id, args) ??
            this.getAliasedWithoutChecks<T>(id, args) ??
            this.getFallback<T>(id, args, mode)
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
        const aliased = this.getAlias(id);

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

    protected getAlias(id: string): string | undefined {
        return this.aliases[id];
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

    protected getFallback<T extends object>(
        id: string,
        _args: unknown[] = [],
        _mode: InvalidReferenceMode = InvalidReferenceMode.NEW_INSTANCE_OR_THROW_EXCEPTION,
    ): T {
        throw new ContainerInvalidReferenceException(id);
    }

    protected publishUnpublishedProvided(id: string): void {
        if (this.isDeferred(id) && !this.isPublished(id)) {
            this.publish(id);
        }
    }
}
