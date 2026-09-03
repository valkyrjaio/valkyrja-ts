/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import { ChildContainer } from '../../../../../src/Valkyrja/Container/Manager/ChildContainer.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ContainerInvalidReferenceException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';
import { ContainerCyclicAliasException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerCyclicAliasException.ts';

import { ProviderFixture } from '../../../Fixtures/Container/Provider/ProviderFixture.ts';
import { ServiceFixture } from '../../../Fixtures/Container/ServiceFixture.ts';
import { SingletonFixture } from '../../../Fixtures/Container/SingletonFixture.ts';

const SERVICE_ID = 'ServiceFixture';
const SINGLETON_ID = 'SingletonFixture';
const PROVIDED_ID = ProviderFixture.PROVIDED_ID;

describe('ChildContainer', () => {
    let parent: Container;
    let child: ChildContainer;

    beforeEach(() => {
        parent = new Container();
        child = new ChildContainer(parent, new ContainerData());
    });

    it('isAlias falls back to the parent, and child aliases do not leak to the parent', () => {
        parent.bindAlias('parentAlias', SERVICE_ID);
        expect(child.isAlias('parentAlias')).toBe(true);
        expect(child.isAlias('unknown')).toBe(false);

        child.bindAlias('childAlias', SERVICE_ID);
        expect(child.isAlias('childAlias')).toBe(true);
        expect(parent.isAlias('childAlias')).toBe(false);
    });

    it('isService falls back to the parent, and child services do not leak to the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceFixture.make(c));
        expect(child.isService(SERVICE_ID)).toBe(true);
        expect(child.isService('unknown')).toBe(false);

        const child2 = new ChildContainer(parent, new ContainerData());
        child2.bind('ChildOnly', (c) => ServiceFixture.make(c));
        expect(child2.isService('ChildOnly')).toBe(true);
        expect(parent.isService('ChildOnly')).toBe(false);
    });

    it('isSingletonInstance falls back to the parent, and child instances do not leak to the parent', () => {
        parent.setSingleton(SINGLETON_ID, new SingletonFixture());
        expect(child.isSingletonInstance(SINGLETON_ID)).toBe(true);
        expect(child.isSingleton(SINGLETON_ID)).toBe(true);

        const child2 = new ChildContainer(parent, new ContainerData());
        child2.setSingleton('ChildOnly', new SingletonFixture());
        expect(child2.isSingletonInstance('ChildOnly')).toBe(true);
        expect(parent.isSingletonInstance('ChildOnly')).toBe(false);
    });

    it('isDeferred falls back to the parent, and child registrations do not leak to the parent', () => {
        parent.register(new ProviderFixture());
        expect(child.isDeferred(ProviderFixture.PROVIDED_ID)).toBe(true);

        const freshParent = new Container();
        const freshChild = new ChildContainer(freshParent, new ContainerData());
        freshChild.register(new ProviderFixture());
        expect(freshChild.has(ProviderFixture.PROVIDED_ID)).toBe(true);
        expect(freshParent.has(ProviderFixture.PROVIDED_ID)).toBe(false);
    });

    it('isPublished falls back to the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceFixture.make(c));
        expect(child.isPublished(SERVICE_ID)).toBe(true);

        child.bind('ChildService', (c) => ServiceFixture.make(c));
        expect(child.isPublished('ChildService')).toBe(true);
    });

    it('getSingleton resolves a singleton instance from the parent', () => {
        const instance = new SingletonFixture();
        parent.setSingleton(SINGLETON_ID, instance);

        expect(child.getSingleton(SINGLETON_ID)).toBe(instance);
    });

    it('getService resolves a service from the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceFixture.make(c));

        expect(child.getService(SERVICE_ID)).toBeInstanceOf(ServiceFixture);
    });

    it('getAliased resolves an aliased service from the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceFixture.make(c));
        parent.bindAlias('parentAlias', SERVICE_ID);

        expect(child.getAliased('parentAlias')).toBeInstanceOf(ServiceFixture);
    });

    it('getService resolves a service bound on the child itself', () => {
        child.bind('ChildService', (c) => ServiceFixture.make(c));

        expect(child.getService('ChildService')).toBeInstanceOf(ServiceFixture);
    });

    it('getAliased resolves an alias bound on the child itself', () => {
        child.bind('ChildService', (c) => ServiceFixture.make(c));
        child.bindAlias('childAlias', 'ChildService');

        expect(child.getAliased('childAlias')).toBeInstanceOf(ServiceFixture);
    });

    it('getAliasedId reads the child first, then the parent', () => {
        parent.bindAlias('parentAlias', SERVICE_ID);
        parent.bindAlias('sharedAlias', SERVICE_ID);
        child.bindAlias('sharedAlias', 'ChildService');

        expect(child.getAliasedId('parentAlias')).toBe(SERVICE_ID);
        expect(child.getAliasedId('sharedAlias')).toBe('ChildService');
        expect(parent.getAliasedId('sharedAlias')).toBe(SERVICE_ID);
        expect(child.getAliasedId('unknown')).toBeUndefined();
    });

    /**
     * Give the parent a cached instance and a publish callback it has not run.
     */
    const hydrateParentWithCachedInstanceAndUnrunCallback = (): void => {
        parent.setFromData(
            new ContainerData({
                services: { [PROVIDED_ID]: () => new SingletonFixture() },
                singletons: { [PROVIDED_ID]: PROVIDED_ID },
            }),
        );
        // Caching through getSingleton() never marks the id published
        parent.getSingleton(PROVIDED_ID);
        parent.setFromData(
            new ContainerData({
                deferredCallback: {
                    [PROVIDED_ID]: (c) => c.setSingleton(PROVIDED_ID, new SingletonFixture()),
                },
            }),
        );
    };

    /**
     * Give the parent a service and a publish callback it has not run.
     */
    const hydrateParentWithServiceAndUnrunCallback = (): void => {
        parent.setFromData(new ContainerData({ services: { [PROVIDED_ID]: (c) => ServiceFixture.make(c) } }));
        parent.setFromData(
            new ContainerData({
                deferredCallback: {
                    [PROVIDED_ID]: (c) => c.bind(PROVIDED_ID, (inner) => ServiceFixture.make(inner)),
                },
            }),
        );
    };

    it('getAliased builds an unresolved parent singleton in the child', () => {
        parent.setFromData(
            new ContainerData({
                aliases: { parentAlias: SINGLETON_ID },
                services: { [SINGLETON_ID]: (c) => SingletonFixture.make(c) },
                singletons: { [SINGLETON_ID]: SINGLETON_ID },
            }),
        );
        const workerChild = new ChildContainer(parent, parent.getData());

        const instance = workerChild.getAliased('parentAlias');

        expect(instance).toBeInstanceOf(SingletonFixture);
        // One request holds one instance, and the parent still holds none
        expect(workerChild.getAliased('parentAlias')).toBe(instance);
        expect(parent.isSingletonInstance(SINGLETON_ID)).toBe(false);
    });

    it('getAliased runs the parent binding in the child when the target is unpublished', () => {
        hydrateParentWithServiceAndUnrunCallback();
        parent.setFromData(new ContainerData({ aliases: { parentAlias: PROVIDED_ID } }));

        const instance = child.getAliased<ServiceFixture>('parentAlias');

        expect(instance).toBeInstanceOf(ServiceFixture);
        expect(instance.getContainer()).toBe(child);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });

    it('getAliased publishes a deferred parent target in the child', () => {
        parent.setFromData(
            new ContainerData({
                aliases: { parentAlias: PROVIDED_ID },
                deferredCallback: {
                    [PROVIDED_ID]: (c) => c.bind(PROVIDED_ID, (inner) => ServiceFixture.make(inner)),
                },
            }),
        );
        const workerChild = new ChildContainer(parent, parent.getData());

        // The child copied the callback, so it publishes the target into itself
        expect(workerChild.getAliased('parentAlias')).toBeInstanceOf(ServiceFixture);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
        expect(parent.isService(PROVIDED_ID)).toBe(false);
    });

    it('getAliased stops at the first resolvable hop of a parent chain', () => {
        parent.setFromData(
            new ContainerData({
                aliases: { outer: 'middle', middle: SERVICE_ID },
                services: {
                    middle: (c) => SingletonFixture.make(c),
                    [SERVICE_ID]: (c) => ServiceFixture.make(c),
                },
                singletons: { middle: 'middle' },
            }),
        );
        const workerChild = new ChildContainer(parent, parent.getData());

        expect(workerChild.getAliased('outer')).toBeInstanceOf(SingletonFixture);
        expect(parent.isSingletonInstance('middle')).toBe(false);
    });

    it('getAliased reports a cyclic parent alias chain', () => {
        parent.setFromData(new ContainerData({ aliases: { first: 'second', second: 'first' } }));

        expect(() => child.getAliased('first')).toThrow(ContainerCyclicAliasException);
    });

    it('getAliased names the pair that closes the cycle', () => {
        parent.setFromData(new ContainerData({ aliases: { first: 'second', second: 'first' } }));

        expect(() => child.getAliased('first')).toThrow(
            'Alias `first` follows a cyclic chain. `first` points back to `second`.',
        );
    });

    it('getAliased reports a parent alias that points at itself', () => {
        parent.setFromData(new ContainerData({ aliases: { self: 'self' } }));

        expect(() => child.getAliased('self')).toThrow(ContainerCyclicAliasException);
    });

    it('getAliased reuses a parent singleton the parent has already built', () => {
        const instance = new SingletonFixture();
        parent.setSingleton(SINGLETON_ID, instance);
        parent.bindAlias('parentAlias', SINGLETON_ID);

        expect(child.getAliased('parentAlias')).toBe(instance);
    });

    it('getAliased lets the parent report a chain that ends at nothing', () => {
        parent.setFromData(new ContainerData({ aliases: { dangling: 'Nothing' } }));

        expect(() => child.getAliased('dangling')).toThrow(ContainerInvalidReferenceException);
    });

    it('get throws when neither container declares the alias', () => {
        expect(() => child.get('unknown')).toThrow(ContainerInvalidReferenceException);
    });

    it('getAliased prefers an alias the child declares over the parent copy', () => {
        const childTarget = new SingletonFixture();
        child.setSingleton('ChildTarget', childTarget);
        child.bindAlias('sharedAlias', 'ChildTarget');
        parent.setFromData(new ContainerData({ aliases: { sharedAlias: PROVIDED_ID } }));
        hydrateParentWithServiceAndUnrunCallback();

        expect(child.getAliased('sharedAlias')).toBe(childTarget);
    });

    it('a parent alias reaches the parent binding when the child shadows the id', () => {
        parent.bindSingleton(SINGLETON_ID, (c) => SingletonFixture.make(c));
        parent.bind(SERVICE_ID, (c) => {
            c.getSingleton(SINGLETON_ID);

            return ServiceFixture.make(c);
        });
        parent.bindAlias('svcFromParent', SERVICE_ID);
        const workerChild = new ChildContainer(parent, parent.getData());
        workerChild.bind(SERVICE_ID, (c) => ServiceFixture.make(c));

        const instance = workerChild.getAliased<ServiceFixture>('svcFromParent');

        // The factory ran with the child, so its dependency cached in the child
        expect(instance.getContainer()).toBe(workerChild);
        expect(workerChild.isSingletonInstance(SINGLETON_ID)).toBe(true);
        expect(parent.isSingletonInstance(SINGLETON_ID)).toBe(false);
    });

    it('getSingleton reuses the parent copy without publishing', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();

        expect(child.getSingleton(PROVIDED_ID)).toBe(parent.getSingletonInstance(PROVIDED_ID));
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });

    it('getService runs the parent binding in the child without publishing', () => {
        hydrateParentWithServiceAndUnrunCallback();

        const instance = child.getService<ServiceFixture>(PROVIDED_ID);

        expect(instance).toBeInstanceOf(ServiceFixture);
        expect(instance.getContainer()).toBe(child);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });

    it('get reads the parent copy before the child alias', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();
        child.setSingleton('ChildTarget', new SingletonFixture());
        child.bindAlias(PROVIDED_ID, 'ChildTarget');

        // get() reads a singleton before an alias, so the parent's copy answers
        expect(child.get(PROVIDED_ID)).toBe(parent.getSingletonInstance(PROVIDED_ID));
    });

    it('getService prefers a service the child declares over the parent copy', () => {
        hydrateParentWithServiceAndUnrunCallback();
        child.bind(PROVIDED_ID, (c) => ServiceFixture.make(c));

        expect(child.getService(PROVIDED_ID)).toBeInstanceOf(ServiceFixture);
    });

    it('getSingletonInstance and getServiceCallable read the child first, then the parent', () => {
        const parentInstance = new SingletonFixture();
        parent.setSingleton(SINGLETON_ID, parentInstance);
        parent.bind(SERVICE_ID, (c) => ServiceFixture.make(c));

        expect(child.getSingletonInstance(SINGLETON_ID)).toBe(parentInstance);
        expect(child.getServiceCallable(SERVICE_ID)).toBeDefined();
        expect(child.getServiceCallable('unknown')).toBeUndefined();

        const childInstance = new SingletonFixture();
        child.setSingleton(SINGLETON_ID, childInstance);
        child.bind(SERVICE_ID, (c) => ServiceFixture.make(c));

        expect(child.getSingletonInstance(SINGLETON_ID)).toBe(childInstance);
        expect(child.getServiceCallable(SERVICE_ID)).toBeDefined();
    });

    it('a child built from the parent data publishes its own copy, and the alias reads the parent', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();
        parent.bindAlias('parentAlias', PROVIDED_ID);
        const workerChild = new ChildContainer(parent, parent.getData());

        // The child holds the callback, so get() publishes the child's own copy first
        expect(workerChild.get(PROVIDED_ID)).not.toBe(parent.getSingletonInstance(PROVIDED_ID));
        // The alias belongs to the parent, so it reads the parent's copy
        expect(workerChild.getAliased('parentAlias')).toBe(parent.getSingletonInstance(PROVIDED_ID));
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });
});
