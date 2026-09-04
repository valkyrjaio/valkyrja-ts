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

import { ProviderFixture } from '../../../Fixtures/Container/Provider/ProviderFixture.ts';
import { PublishingProviderFixture } from '../../../Fixtures/Container/Provider/PublishingProviderFixture.ts';
import { ServiceFixture } from '../../../Fixtures/Container/ServiceFixture.ts';
import { SingletonFixture } from '../../../Fixtures/Container/SingletonFixture.ts';

const SERVICE_ID = 'ServiceFixture';
const SINGLETON_ID = 'SingletonFixture';

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

    it('reads a deferred registration from the snapshot, and child registrations do not leak to the parent', () => {
        parent.register(new ProviderFixture());
        expect(new ChildContainer(parent, parent.getData()).isDeferred(ProviderFixture.PROVIDED_ID)).toBe(true);

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

    describe('as the worker uses it', () => {
        // The parent is configured at boot, then one snapshot builds each child
        const boot = (): Container => {
            const configured = new Container();
            configured.bindSingleton('Resolved', (c) => SingletonFixture.make(c));
            configured.bindSingleton('Unresolved', (c) => ServiceFixture.make(c));
            configured.bind('Fresh', (c) => ServiceFixture.make(c));
            configured.bindAlias('UnresolvedAlias', 'Unresolved');
            configured.bindAlias('ResolvedAlias', 'Resolved');

            return configured;
        };

        it('shares a singleton the parent resolved before the request loop', () => {
            const booted = boot();
            const shared = booted.getSingleton('Resolved');
            const request = new ChildContainer(booted, booted.getData());

            expect(request.get('Resolved')).toBe(shared);
            expect(request.get('ResolvedAlias')).toBe(shared);
        });

        it('builds a singleton the parent never resolved in the child, once', () => {
            const booted = boot();
            const request = new ChildContainer(booted, booted.getData());

            const built = request.get('Unresolved');

            expect(request.get('Unresolved')).toBe(built);
            expect(request.get('UnresolvedAlias')).toBe(built);
            expect(booted.isSingletonInstance('Unresolved')).toBe(false);
        });

        it('gives each request its own copy of an unresolved parent singleton', () => {
            const booted = boot();
            const data = booted.getData();

            const first = new ChildContainer(booted, data).get('Unresolved');
            const second = new ChildContainer(booted, data).get('Unresolved');

            expect(first).not.toBe(second);
            expect(booted.isSingletonInstance('Unresolved')).toBe(false);
        });

        it('keeps a request-scoped registration out of the parent and the next request', () => {
            const booted = boot();
            const data = booted.getData();
            const request = new ChildContainer(booted, data);
            const scoped = new SingletonFixture();
            request.setSingleton('RequestScoped', scoped);

            expect(request.get('RequestScoped')).toBe(scoped);
            expect(booted.has('RequestScoped')).toBe(false);
            expect(new ChildContainer(booted, data).has('RequestScoped')).toBe(false);
        });

        it('runs a plain parent binding for each request', () => {
            const booted = boot();
            const data = booted.getData();

            expect(new ChildContainer(booted, data).get('Fresh')).not.toBe(
                new ChildContainer(booted, data).get('Fresh'),
            );
        });
        it('reaches the parent binding through an alias the parent alone declares', () => {
            const booted = boot();
            booted.bind('Shadowed', (c) => ServiceFixture.make(c));
            booted.bindAlias('ShadowedFromParent', 'Shadowed');
            const request = new ChildContainer(booted, booted.getData());
            request.bind('Shadowed', (c) => SingletonFixture.make(c));

            expect(request.get('Shadowed')).toBeInstanceOf(SingletonFixture);
            expect(request.get('ShadowedFromParent')).toBeInstanceOf(ServiceFixture);
        });
        it('returns undefined when neither container declares the alias', () => {
            const booted = boot();
            const request = new ChildContainer(booted, booted.getData());

            expect(() => request.getAliased('nothingDeclaresThis')).toThrow(ContainerInvalidReferenceException);
        });
        it('publishes a deferred parent target in the child', () => {
            const booted = boot();
            booted.register(new PublishingProviderFixture());
            booted.bindAlias('providedAlias', PublishingProviderFixture.PROVIDED_ID);
            const request = new ChildContainer(booted, booted.getData());

            // The child holds the same callback, so it publishes into itself
            const fromId = request.get(PublishingProviderFixture.PROVIDED_ID);
            const fromAlias = request.get('providedAlias');

            expect(fromId).toBe(fromAlias);
            expect(booted.isPublished(PublishingProviderFixture.PROVIDED_ID)).toBe(false);
            expect(booted.isSingletonInstance(PublishingProviderFixture.PROVIDED_ID)).toBe(false);
        });

        it('reuses a parent target the parent already published', () => {
            const booted = boot();
            booted.register(new PublishingProviderFixture());
            booted.bindAlias('providedAlias', PublishingProviderFixture.PROVIDED_ID);
            // The parent publishes at boot, so the request reuses what it holds
            const shared = booted.get(PublishingProviderFixture.PROVIDED_ID);
            const request = new ChildContainer(booted, booted.getData());

            expect(request.getAliased('providedAlias')).toBe(shared);
        });

        it('stops the walk at a parent service in the chain', () => {
            const booted = boot();
            // The parent answers 'middle' as a service, so it never reaches the rest
            booted.bindAlias('outer', 'middle');
            booted.bind('middle', (c) => ServiceFixture.make(c));
            booted.bindAlias('middle', 'Unresolved');
            const request = new ChildContainer(booted, booted.getData());

            expect(request.getAliased('outer')).toBeInstanceOf(ServiceFixture);
            expect(booted.isSingletonInstance('Unresolved')).toBe(false);
        });

        it('reads a singleton binding from the child, then the parent', () => {
            const booted = boot();
            const request = new ChildContainer(booted, booted.getData());
            request.bindSingleton('ChildOnly', (c) => ServiceFixture.make(c));
            // A snapshot copies the parent's bindings, so only a later one reaches the fallback
            booted.bindSingleton('LaterOnParent', (c) => SingletonFixture.make(c));

            expect(request.isSingletonBinding('ChildOnly')).toBe(true);
            expect(request.isSingletonBinding('LaterOnParent')).toBe(true);
            expect(request.isSingletonBinding('nothingDeclaresThis')).toBe(false);
        });

        it('stops the walk at a deferred hop in the chain', () => {
            const booted = boot();
            // The parent publishes before it reads any map, so it stops at the deferred hop
            booted.register(new PublishingProviderFixture());
            booted.bindAlias('outer', PublishingProviderFixture.PROVIDED_ID);
            booted.bindAlias(PublishingProviderFixture.PROVIDED_ID, 'Fresh');
            const request = new ChildContainer(booted, booted.getData());

            // The child holds the same callback, so it publishes into itself
            const fromId = request.get(PublishingProviderFixture.PROVIDED_ID);

            expect(request.getAliased('outer')).toBe(fromId);
            expect(booted.isPublished(PublishingProviderFixture.PROVIDED_ID)).toBe(false);
            expect(booted.isSingletonInstance(PublishingProviderFixture.PROVIDED_ID)).toBe(false);
        });

        it('stops the walk at a parent instance in the chain', () => {
            const booted = boot();
            // The parent holds 'middle' as an instance, so it never reaches the rest
            const shared = new SingletonFixture();
            booted.bindAlias('outer', 'middle');
            booted.setSingleton('middle', shared);
            booted.bindAlias('middle', 'Fresh');
            const request = new ChildContainer(booted, booted.getData());

            expect(request.getAliased('outer')).toBe(shared);
        });

        it('stops the walk where the parent stops', () => {
            const booted = boot();
            // The parent answers 'middle' as a singleton, so it never reaches the rest
            booted.bindAlias('outer', 'middle');
            booted.bindSingleton('middle', (c) => SingletonFixture.make(c));
            booted.bindAlias('middle', 'Fresh');
            const request = new ChildContainer(booted, booted.getData());

            expect(request.getAliased('outer')).toBeInstanceOf(SingletonFixture);
            expect(booted.isSingletonInstance('middle')).toBe(false);
        });

        it('resolves a chain onto an unbuilt parent singleton in the child', () => {
            const booted = boot();
            booted.bindAlias('middle', 'Unresolved');
            booted.bindAlias('outer', 'middle');
            const request = new ChildContainer(booted, booted.getData());

            const instance = request.get('outer');

            expect(instance).toBeInstanceOf(ServiceFixture);
            expect(request.get('Unresolved')).toBe(instance);
            expect(booted.isSingletonInstance('Unresolved')).toBe(false);
        });
    });
});
