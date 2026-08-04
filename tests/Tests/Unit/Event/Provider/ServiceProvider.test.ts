/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ListenerCollection } from '../../../../../src/Valkyrja/Event/Collection/ListenerCollection.ts';
import { EventServiceId } from '../../../../../src/Valkyrja/Event/Constant/EventServiceId.ts';
import { EventData } from '../../../../../src/Valkyrja/Event/Data/EventData.ts';
import { Listener } from '../../../../../src/Valkyrja/Event/Data/Listener.ts';
import { EventDispatcher } from '../../../../../src/Valkyrja/Event/Dispatcher/EventDispatcher.ts';
import { EventServiceProvider } from '../../../../../src/Valkyrja/Event/Provider/EventServiceProvider.ts';

import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';
import { ListenerProviderFixture } from '../../../Fixtures/Event/Provider/ListenerProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ListenerCollectionContract } from '../../../../../src/Valkyrja/Event/Collection/Contract/ListenerCollectionContract.ts';
import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';

const makeContainer = (debugMode: boolean, eventProviders: ListenerProviderContract[] = []): ContainerContract => {
    const container = new Container();
    const app = {
        getDebugMode: () => debugMode,
        getEventProviders: () => eventProviders,
    } as unknown as ApplicationContract;

    container.setSingleton(ApplicationServiceId.ApplicationContract, app);

    return container;
};

describe('EventServiceProvider', () => {
    it('publishes the dispatcher, the collection, and the data', () => {
        const publishers = new EventServiceProvider().publishers();

        expect(Object.keys(publishers)).toStrictEqual([
            EventServiceId.EventDispatcherContract,
            EventServiceId.ListenerCollectionContract,
            EventServiceId.EventData,
        ]);
        expect(typeof publishers[EventServiceId.EventDispatcherContract]).toBe('function');
    });

    it('publishDispatcher stores the dispatcher over the published collection', () => {
        const container = makeContainer(false);

        container.setSingleton(EventServiceId.ListenerCollectionContract, new ListenerCollection());

        EventServiceProvider.publishDispatcher(container);

        expect(container.getSingleton(EventServiceId.EventDispatcherContract)).toBeInstanceOf(EventDispatcher);
    });

    it('publishListenerCollection loads the stored data when debug mode is off', () => {
        const listener = new Listener(EventFixture.EVENT_ID, 'listener-name', () => null);
        const container = makeContainer(false);

        container.setSingleton(
            EventServiceId.EventData,
            new EventData({ [EventFixture.EVENT_ID]: ['listener-name'] }, { 'listener-name': () => listener }),
        );

        EventServiceProvider.publishListenerCollection(container);

        const collection = container.getSingleton<ListenerCollectionContract>(
            EventServiceId.ListenerCollectionContract,
        );

        expect(collection).toBeInstanceOf(ListenerCollection);
        expect(collection.hasListenerById('listener-name')).toBe(true);
        expect(collection.hasListenersForEventById(EventFixture.EVENT_ID)).toBe(true);
    });

    it('publishListenerCollection collects from the providers when debug mode is on', () => {
        const container = makeContainer(true, [new ListenerProviderFixture()]);

        EventServiceProvider.publishListenerCollection(container);

        const collection = container.getSingleton<ListenerCollectionContract>(
            EventServiceId.ListenerCollectionContract,
        );

        expect(collection.hasListenerById(ListenerProviderFixture.LISTENER_NAME)).toBe(true);
        expect(container.getSingleton<EventData>(EventServiceId.EventData).events).toStrictEqual({
            [EventFixture.EVENT_ID]: [ListenerProviderFixture.LISTENER_NAME],
        });
    });

    it('publishData records every listener of every provider', () => {
        const container = makeContainer(true, [new ListenerProviderFixture(), new ListenerProviderFixture()]);

        container.setSingleton(EventServiceId.ListenerCollectionContract, new ListenerCollection());

        EventServiceProvider.publishData(container);

        const data = container.getSingleton<EventData>(EventServiceId.EventData);

        expect(data.events).toStrictEqual({ [EventFixture.EVENT_ID]: [ListenerProviderFixture.LISTENER_NAME] });
        expect(Object.keys(data.listeners)).toStrictEqual([ListenerProviderFixture.LISTENER_NAME]);
    });

    it('publishData records nothing when the application has no event providers', () => {
        const container = makeContainer(true);

        container.setSingleton(EventServiceId.ListenerCollectionContract, new ListenerCollection());

        EventServiceProvider.publishData(container);

        expect(container.getSingleton<EventData>(EventServiceId.EventData).events).toStrictEqual({});
    });

    it('the registered provider publishes each of its services on demand', () => {
        const container = makeContainer(true, [new ListenerProviderFixture()]);

        container.register(new EventServiceProvider());

        const dispatcher = container.getSingleton(EventServiceId.EventDispatcherContract);

        expect(dispatcher).toBeInstanceOf(EventDispatcher);
        expect(
            container
                .getSingleton<ListenerCollectionContract>(EventServiceId.ListenerCollectionContract)
                .hasListenerById(ListenerProviderFixture.LISTENER_NAME),
        ).toBe(true);
    });
});
