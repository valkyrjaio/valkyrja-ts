/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ChildContainer } from '../../../../src/Valkyrja/Container/Manager/ChildContainer.ts';
import { Container } from '../../../../src/Valkyrja/Container/Manager/Container.ts';

import { PublishingProviderFixture } from '../../Fixtures/Container/Provider/PublishingProviderFixture.ts';
import { ServiceFixture } from '../../Fixtures/Container/ServiceFixture.ts';
import { SingletonFixture } from '../../Fixtures/Container/SingletonFixture.ts';

describe('ChildContainer lifecycle (functional)', () => {
    it('gives each request its own scope and leaves the parent alone', () => {
        const parent = new Container();

        // Boot. Everything a worker registers before the request loop begins.
        parent.register(new PublishingProviderFixture());
        parent.bindSingleton('Shared', (c) => SingletonFixture.make(c));
        parent.bindSingleton('Unbuilt', (c) => SingletonFixture.make(c));
        parent.bind('Fresh', (c) => ServiceFixture.make(c));
        parent.bindAlias('SharedAlias', 'Shared');
        const shared = parent.getSingleton('Shared');

        // One snapshot, taken once, read by every request.
        const data = parent.getData();
        const registrations = parent.getData();

        const unbuilt: object[] = [];
        const provided: object[] = [];

        for (let request = 0; request < 3; request++) {
            const child = new ChildContainer(parent, data);

            // A fresh child carries nothing the last request registered
            expect(child.isSingletonInstance('Request')).toBe(false);

            const requestScoped = new SingletonFixture();
            child.setSingleton('Request', requestScoped);

            // The parent built this one before the loop, so every request shares it
            expect(child.getSingleton('Shared')).toBe(shared);
            expect(child.getAliased('SharedAlias')).toBe(shared);

            // The parent never built this one, so the request builds its own
            const own = child.getSingleton('Unbuilt');
            unbuilt.push(own);
            expect(child.getSingleton('Unbuilt')).toBe(own);

            // The child holds the publish callback, so it publishes into itself
            provided.push(child.get(PublishingProviderFixture.PROVIDED_ID));

            // A bound factory runs for each call, and caches nowhere
            expect(child.get('Fresh')).not.toBe(child.get('Fresh'));

            expect(child.getSingleton('Request')).toBe(requestScoped);
        }

        // Nothing a request registered reaches the parent
        expect(parent.has('Request')).toBe(false);
        expect(parent.isSingletonInstance('Unbuilt')).toBe(false);
        expect(parent.isSingletonInstance('Fresh')).toBe(false);
        expect(parent.isPublished(PublishingProviderFixture.PROVIDED_ID)).toBe(false);
        expect(parent.isSingletonInstance(PublishingProviderFixture.PROVIDED_ID)).toBe(false);

        // Nothing one request built reaches another
        expect(unbuilt[0]).not.toBe(unbuilt[1]);
        expect(unbuilt[1]).not.toBe(unbuilt[2]);
        expect(provided[0]).not.toBe(provided[1]);
        expect(provided[1]).not.toBe(provided[2]);

        // The parent still holds the registrations it booted with
        expect(parent.getData().aliases).toEqual(registrations.aliases);
        expect(parent.getData().singletons).toEqual(registrations.singletons);
        expect(Object.keys(parent.getData().services)).toEqual(Object.keys(registrations.services));
        expect(Object.keys(parent.getData().deferredCallback)).toEqual(Object.keys(registrations.deferredCallback));
    });
});
