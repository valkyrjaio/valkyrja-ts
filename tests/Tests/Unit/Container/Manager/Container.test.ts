/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ContainerInvalidPublishCallbackException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidPublishCallbackException.ts';
import { ContainerCyclicAliasException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerCyclicAliasException.ts';
import { ContainerInvalidReferenceException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';

import { InvalidProviderFixture } from '../../../Fixtures/Container/Provider/InvalidProviderFixture.ts';
import { ProviderFixture } from '../../../Fixtures/Container/Provider/ProviderFixture.ts';
import { ServiceFixture } from '../../../Fixtures/Container/ServiceFixture.ts';
import { SingletonFixture } from '../../../Fixtures/Container/SingletonFixture.ts';

const SERVICE_ID = 'ServiceFixture';
const SINGLETON_ID = 'SingletonFixture';

describe('Container', () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        ProviderFixture.publishCalled = false;
        ProviderFixture.publishSecondaryCalled = false;
    });

    it('bind registers a service that returns a new instance each time', () => {
        container.bind(SERVICE_ID, (c) => ServiceFixture.make(c));

        expect(container.has(SERVICE_ID)).toBe(true);
        expect(container.isService(SERVICE_ID)).toBe(true);
        expect(container.isPublished(SERVICE_ID)).toBe(true);
        expect(container.isAlias(SERVICE_ID)).toBe(false);
        expect(container.isSingleton(SERVICE_ID)).toBe(false);

        const service = container.get<ServiceFixture>(SERVICE_ID);
        expect(service).toBeInstanceOf(ServiceFixture);
        expect(container.get(SERVICE_ID)).not.toBe(service);
        expect(container.getService(SERVICE_ID)).not.toBe(service);
    });

    it('bindAlias resolves an alias to its bound service', () => {
        const alias = 'alias';
        container.bind(SERVICE_ID, (c) => ServiceFixture.make(c));
        container.bindAlias(alias, SERVICE_ID);

        expect(container.has(alias)).toBe(true);
        expect(container.isAlias(alias)).toBe(true);
        expect(container.isPublished(SERVICE_ID)).toBe(true);
        expect(container.isService(alias)).toBe(false);

        const service = container.get<ServiceFixture>(alias);
        expect(service).toBeInstanceOf(ServiceFixture);
        expect(container.get(alias)).not.toBe(service);
        expect(container.getAliased(alias)).toBeInstanceOf(ServiceFixture);
    });

    it('bindSingleton registers a service that returns the same instance each time', () => {
        container.bindSingleton(SINGLETON_ID, (c) => SingletonFixture.make(c));

        expect(container.has(SINGLETON_ID)).toBe(true);
        expect(container.isSingleton(SINGLETON_ID)).toBe(true);
        expect(container.isService(SINGLETON_ID)).toBe(true);
        expect(container.isPublished(SINGLETON_ID)).toBe(true);
        expect(container.isAlias(SINGLETON_ID)).toBe(false);

        const service = container.get<SingletonFixture>(SINGLETON_ID);
        expect(service).toBeInstanceOf(SingletonFixture);
        expect(container.get(SINGLETON_ID)).toBe(service);
        expect(container.getSingleton(SINGLETON_ID)).toBe(service);
    });

    it('throws when a singleton factory resolves to undefined', () => {
        container.bindSingleton(SINGLETON_ID, (() => undefined) as never);

        expect(() => container.getSingleton(SINGLETON_ID)).toThrow(ContainerInvalidReferenceException);
    });

    it('setSingleton registers an existing instance', () => {
        const instance = new SingletonFixture();
        container.setSingleton(SINGLETON_ID, instance);

        expect(container.isSingletonInstance(SINGLETON_ID)).toBe(true);
        expect(container.isPublished(SINGLETON_ID)).toBe(true);
        expect(container.getSingleton(SINGLETON_ID)).toBe(instance);
    });

    it('register marks a provider’s publishers as deferred', () => {
        container.register(new ProviderFixture());

        expect(container.has(ProviderFixture.PROVIDED_ID)).toBe(true);
        expect(container.isDeferred(ProviderFixture.PROVIDED_ID)).toBe(true);
        expect(container.isDeferred(ProviderFixture.PROVIDED_SECONDARY_ID)).toBe(true);
    });

    it('register throws when a publisher is not callable', () => {
        expect(() => {
            container.register(new InvalidProviderFixture());
        }).toThrow(ContainerInvalidPublishCallbackException);
    });

    it('publish runs a deferred callback and marks it published', () => {
        container.register(new ProviderFixture());

        container.publish(ProviderFixture.PROVIDED_ID);

        expect(ProviderFixture.publishCalled).toBe(true);
        expect(container.isPublished(ProviderFixture.PROVIDED_ID)).toBe(true);
    });

    it('publish is a no-op for an unknown id', () => {
        expect(() => {
            container.publish('NotDeferred');
        }).not.toThrow();
    });

    it('resolving a deferred id publishes it before resolving', () => {
        container.register(new ProviderFixture());

        // The fixture publisher only flips a flag (it does not register the service), so resolution still throws.
        expect(() => container.getSingleton(ProviderFixture.PROVIDED_ID)).toThrow(ContainerInvalidReferenceException);
        expect(ProviderFixture.publishCalled).toBe(true);
    });

    it('get throws for a non-existent id', () => {
        expect(() => container.get('Missing')).toThrow(ContainerInvalidReferenceException);
    });

    it('getSingleton throws for a non-existent id', () => {
        expect(() => container.getSingleton(SERVICE_ID)).toThrow(ContainerInvalidReferenceException);
    });

    it('getAliased throws for a non-existent alias', () => {
        expect(() => container.getAliased('Missing')).toThrow(ContainerInvalidReferenceException);
    });

    it('getService throws for a non-existent id', () => {
        expect(() => container.getService(SERVICE_ID)).toThrow(ContainerInvalidReferenceException);
    });

    it('getData returns the registered deferred callbacks and empty collections', () => {
        container.register(new ProviderFixture());

        const data = container.getData();

        expect(typeof data.deferredCallback[ProviderFixture.PROVIDED_ID]).toBe('function');
        expect(typeof data.deferredCallback[ProviderFixture.PROVIDED_SECONDARY_ID]).toBe('function');
        expect(data.aliases).toStrictEqual({});
        expect(data.services).toStrictEqual({});
        expect(data.singletons).toStrictEqual({});
    });

    it('setFromData copies deferred state into another container', () => {
        container.register(new ProviderFixture());
        const data = container.getData();

        const target = new Container();
        expect(target.has(ProviderFixture.PROVIDED_ID)).toBe(false);

        target.setFromData(data);

        expect(target.has(ProviderFixture.PROVIDED_ID)).toBe(true);
    });

    it('constructs from existing data', () => {
        container.register(new ProviderFixture());
        const data = container.getData();

        const target = new Container(data);

        expect(target.has(ProviderFixture.PROVIDED_ID)).toBe(true);
    });

    it('bindAlias rejects a chain that returns to the alias', () => {
        const container = new Container();
        container.bindAlias('first', 'second');

        expect(() => container.bindAlias('second', 'first')).toThrow(ContainerCyclicAliasException);
    });

    it('bindAlias rejects a longer chain that returns to the alias', () => {
        const container = new Container();
        container.bindAlias('first', 'second');
        container.bindAlias('second', 'third');

        expect(() => container.bindAlias('third', 'first')).toThrow(ContainerCyclicAliasException);
    });

    it('bindAlias allows a chain that does not return, and getAliasedId reads one hop', () => {
        const container = new Container();
        container.bindAlias('first', 'second');
        container.bindAlias('second', SERVICE_ID);

        expect(container.getAliasedId('first')).toBe('second');
        expect(container.getAliasedId('second')).toBe(SERVICE_ID);
        expect(container.getAliasedId('unknown')).toBeUndefined();
    });

    it('bindAlias rejects an alias of itself', () => {
        const container = new Container();

        expect(() => container.bindAlias(SERVICE_ID, SERVICE_ID)).toThrow(ContainerCyclicAliasException);
    });

    it('setFromData rejects a cyclic alias map', () => {
        const container = new Container();
        // setFromData() is an entry point for aliases, so it validates them too
        const data = new ContainerData({ aliases: { first: 'second', second: 'first' } });

        expect(() => {
            container.setFromData(data);
        }).toThrow(ContainerCyclicAliasException);
    });

    it('the constructor rejects a cyclic alias map an alias is no part of', () => {
        // 'third' sits outside the cycle and is swept first, so its walk needs a bound
        const data = new ContainerData({ aliases: { third: 'first', first: 'second', second: 'first' } });

        expect(() => new Container(data)).toThrow(ContainerCyclicAliasException);
    });

    it('the constructor accepts a map of aliases that do not return', () => {
        const data = new ContainerData({ aliases: { first: 'second', second: SERVICE_ID } });

        const container = new Container(data);

        expect(container.getAliasedId('first')).toBe('second');
        expect(container.getAliasedId('second')).toBe(SERVICE_ID);
    });

    it('the constructor rejects a cyclic alias map', () => {
        const data = new ContainerData({ aliases: { first: 'second', second: 'first' } });

        expect(() => new Container(data)).toThrow(ContainerCyclicAliasException);
    });
});
