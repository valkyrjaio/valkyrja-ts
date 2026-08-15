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
import { ContainerUnpublishedParentTargetException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerUnpublishedParentTargetException.ts';
import { ContainerUnresolvedParentAliasException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerUnresolvedParentAliasException.ts';

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

    it('getAliased refuses a parent alias whose target the parent has not published', () => {
        parent.setFromData(new ContainerData({ aliases: { parentAlias: PROVIDED_ID } }));
        hydrateParentWithServiceAndUnrunCallback();

        expect(() => child.getAliased('parentAlias')).toThrow(ContainerUnresolvedParentAliasException);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });

    it('getAliased refuses a parent alias whose target the parent has never built', () => {
        parent.setFromData(
            new ContainerData({
                aliases: { parentAlias: SINGLETON_ID },
                services: { [SINGLETON_ID]: (c) => SingletonFixture.make(c) },
                singletons: { [SINGLETON_ID]: SINGLETON_ID },
            }),
        );

        expect(() => child.getAliased('parentAlias')).toThrow(ContainerUnresolvedParentAliasException);
        expect(parent.isSingletonInstance(SINGLETON_ID)).toBe(false);
    });

    it('getAliased refuses an unresolved target reached part way along a parent chain', () => {
        parent.setFromData(
            new ContainerData({
                aliases: { first: 'second', second: SINGLETON_ID },
                services: { [SINGLETON_ID]: (c) => SingletonFixture.make(c) },
                singletons: { [SINGLETON_ID]: SINGLETON_ID },
            }),
        );

        expect(() => child.getAliased('first')).toThrow(ContainerUnresolvedParentAliasException);
    });

    it('getAliased reports a cyclic parent alias chain as an invalid reference', () => {
        parent.setFromData(new ContainerData({ aliases: { first: 'second', second: 'first' } }));

        expect(() => child.getAliased('first')).toThrow(ContainerInvalidReferenceException);
    });

    it('getAliased reports a parent alias that points at itself as an invalid reference', () => {
        parent.setFromData(new ContainerData({ aliases: { self: 'self' } }));

        expect(() => child.getAliased('self')).toThrow(ContainerInvalidReferenceException);
    });

    it('getAliased reuses a parent singleton the parent has already built', () => {
        const instance = new SingletonFixture();
        parent.setSingleton(SINGLETON_ID, instance);
        parent.bindAlias('parentAlias', SINGLETON_ID);

        expect(child.getAliased('parentAlias')).toBe(instance);
    });

    it('getAliased returns undefined through get when neither container declares the alias', () => {
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

    it('getSingleton refuses a parent instance whose publish callback has not run', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();

        expect(() => child.getSingleton(PROVIDED_ID)).toThrow(ContainerUnpublishedParentTargetException);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });

    it('getSingleton builds in the child when the parent copy is unpublished', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();
        child.bindSingleton(PROVIDED_ID, (c) => SingletonFixture.make(c));

        const instance = child.getSingleton(PROVIDED_ID);

        expect(instance).toBeInstanceOf(SingletonFixture);
        expect(instance).not.toBe(parent.getSingleton(PROVIDED_ID));
    });

    it('get falls through to the child alias when the parent instance is unpublished', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();
        const childTarget = new SingletonFixture();
        child.setSingleton('ChildTarget', childTarget);
        child.bindAlias(PROVIDED_ID, 'ChildTarget');

        expect(child.get(PROVIDED_ID)).toBe(childTarget);
    });

    it('getService refuses a parent service whose publish callback has not run', () => {
        hydrateParentWithServiceAndUnrunCallback();

        expect(() => child.getService(PROVIDED_ID)).toThrow(ContainerUnpublishedParentTargetException);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);
    });

    it('get falls through to the child alias when the parent service is unpublished', () => {
        hydrateParentWithServiceAndUnrunCallback();
        const childTarget = new SingletonFixture();
        child.setSingleton('ChildTarget', childTarget);
        child.bindAlias(PROVIDED_ID, 'ChildTarget');

        expect(child.get(PROVIDED_ID)).toBe(childTarget);
    });

    it('getService prefers a service the child declares over the parent copy', () => {
        hydrateParentWithServiceAndUnrunCallback();
        child.bind(PROVIDED_ID, (c) => ServiceFixture.make(c));

        expect(child.getService(PROVIDED_ID)).toBeInstanceOf(ServiceFixture);
    });

    it('getService delegates to the parent once the parent has published the target', () => {
        hydrateParentWithServiceAndUnrunCallback();
        parent.publish(PROVIDED_ID);

        expect(child.getService(PROVIDED_ID)).toBeInstanceOf(ServiceFixture);
    });

    it('getSingleton answers from a service the child declares when the parent copy is unpublished', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();
        child.bind(PROVIDED_ID, (c) => ServiceFixture.make(c));

        expect(child.get(PROVIDED_ID)).toBeInstanceOf(ServiceFixture);
    });

    it('getAliased lets the parent report a chain that ends at nothing', () => {
        parent.setFromData(new ContainerData({ aliases: { dangling: 'Nothing' } }));

        expect(() => child.getAliased('dangling')).toThrow(ContainerInvalidReferenceException);
    });

    it('a child built from the parent data publishes the target itself, and still refuses the alias', () => {
        hydrateParentWithCachedInstanceAndUnrunCallback();
        parent.bindAlias('parentAlias', PROVIDED_ID);
        const workerChild = new ChildContainer(parent, parent.getData());

        // The child holds its own copy of the callback, so the bare id costs the parent nothing
        expect(workerChild.get(PROVIDED_ID)).toBeInstanceOf(SingletonFixture);
        expect(parent.isPublished(PROVIDED_ID)).toBe(false);

        // The alias belongs to the parent, so it asks the parent, which would publish
        expect(() => workerChild.getAliased('parentAlias')).toThrow(ContainerUnresolvedParentAliasException);
    });
});
