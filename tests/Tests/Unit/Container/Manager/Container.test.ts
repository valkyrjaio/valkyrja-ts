/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { InvalidReferenceMode } from '../../../../../src/Valkyrja/Container/Enum/InvalidReferenceMode.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ContainerInvalidPublishCallbackException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidPublishCallbackException.ts';
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

    // The TS container ignores InvalidReferenceMode in getFallback (always throws); PHP's
    // NEW_INSTANCE_OR_THROW_EXCEPTION would instead try to instantiate. See TODO.md.
    it('get throws regardless of the invalid-reference mode', () => {
        expect(() => container.get(SINGLETON_ID, [], InvalidReferenceMode.NEW_INSTANCE_OR_THROW_EXCEPTION)).toThrow(
            ContainerInvalidReferenceException,
        );
        expect(() => container.get(SINGLETON_ID, [], InvalidReferenceMode.THROW_EXCEPTION)).toThrow(
            ContainerInvalidReferenceException,
        );
    });
});
