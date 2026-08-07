/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ListenerCollection } from '../../../../../src/Valkyrja/Event/Collection/ListenerCollection.ts';
import { Listener } from '../../../../../src/Valkyrja/Event/Data/Listener.ts';
import { EventDispatcher } from '../../../../../src/Valkyrja/Event/Dispatcher/EventDispatcher.ts';
import { EventInvalidEventException } from '../../../../../src/Valkyrja/Event/Throwable/Exception/EventInvalidEventException.ts';

import { ArgumentsCapableEventFixture } from '../../../Fixtures/Event/ArgumentsCapableEventFixture.ts';
import { DispatchCollectableEventFixture } from '../../../Fixtures/Event/DispatchCollectableEventFixture.ts';
import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';
import { StoppableEventFixture } from '../../../Fixtures/Event/StoppableEventFixture.ts';

import type { ContainerContract } from '../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ListenerContract } from '../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

const collectableEventId = DispatchCollectableEventFixture.EVENT_ID;

const makeListener = (name: string, eventId: string, returns: unknown = 'test'): ListenerContract =>
    new Listener(eventId, name, () => returns);

const makeContainer = (): ContainerContract => {
    const container = new Container();

    container.bind(collectableEventId, () => new DispatchCollectableEventFixture());
    container.bind(StoppableEventFixture.EVENT_ID, () => new StoppableEventFixture());
    container.bind(ArgumentsCapableEventFixture.EVENT_ID, () => new ArgumentsCapableEventFixture());
    container.bind(EventFixture.EVENT_ID, () => new EventFixture());

    return container;
};

describe('EventDispatcher', () => {
    it('builds with its own collection and container when it is given neither', () => {
        const dispatcher = new EventDispatcher();

        const event = new EventFixture();

        expect(dispatcher.dispatch(event)).toBe(event);
    });

    it('dispatch runs every listener for the event', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('listener', collectableEventId));

        const dispatcher = new EventDispatcher(collection, makeContainer());
        const event = new DispatchCollectableEventFixture();

        expect(dispatcher.dispatch(event)).toBe(event);
        expect(event.getDispatches()).toStrictEqual(['test']);
    });

    it('dispatch collects each dispatch in the order that the listeners were added', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('first', collectableEventId, 'one'));
        collection.addListener(makeListener('second', collectableEventId, 'two'));
        collection.addListener(makeListener('third', collectableEventId, 'three'));

        const dispatcher = new EventDispatcher(collection, makeContainer());
        const event = new DispatchCollectableEventFixture();

        dispatcher.dispatch(event);

        expect(event.getDispatches()).toStrictEqual(['one', 'two', 'three']);
    });

    it('dispatch passes the container and the event to the handler', () => {
        const collection = new ListenerCollection();
        const container = makeContainer();
        const event = new DispatchCollectableEventFixture();

        let receivedContainer: ContainerContract | undefined = undefined;
        let receivedEvent: unknown = undefined;

        collection.addListener(
            new Listener(collectableEventId, 'listener', (handlerContainer, args) => {
                receivedContainer = handlerContainer;
                receivedEvent = args['event'];

                return null;
            }),
        );

        new EventDispatcher(collection, container).dispatch(event);

        expect(receivedContainer).toBe(container);
        expect(receivedEvent).toBe(event);
    });

    it('dispatch leaves an event that collects nothing alone', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('listener', EventFixture.EVENT_ID));

        const dispatcher = new EventDispatcher(collection, makeContainer());
        const event = new EventFixture();

        expect(dispatcher.dispatch(event)).toBe(event);
    });

    it('dispatchIfHasListeners runs the listeners only when the event has some', () => {
        const collection = new ListenerCollection();
        const dispatcher = new EventDispatcher(collection, makeContainer());
        const event = new DispatchCollectableEventFixture();

        expect(dispatcher.dispatchIfHasListeners(event)).toBe(event);
        expect(event.getDispatches()).toStrictEqual([]);

        collection.addListener(makeListener('listener', collectableEventId));

        expect(dispatcher.dispatchIfHasListeners(event)).toBe(event);
        expect(event.getDispatches()).toStrictEqual(['test']);
    });

    it('dispatchById builds the event from the container and dispatches it', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('listener', collectableEventId));

        const dispatcher = new EventDispatcher(collection, makeContainer());

        const event = dispatcher.dispatchById(collectableEventId);

        expect(event).toBeInstanceOf(DispatchCollectableEventFixture);
        expect((event as DispatchCollectableEventFixture).getDispatches()).toStrictEqual(['test']);
    });

    it('dispatchById fills an arguments capable event with the arguments', () => {
        const dispatcher = new EventDispatcher(new ListenerCollection(), makeContainer());

        const event = dispatcher.dispatchById(ArgumentsCapableEventFixture.EVENT_ID, ['first', 'second']);

        expect(event).toBeInstanceOf(ArgumentsCapableEventFixture);
        expect((event as ArgumentsCapableEventFixture).getArguments()).toStrictEqual(['first', 'second']);
    });

    it('dispatchById leaves an event that takes no arguments alone', () => {
        const dispatcher = new EventDispatcher(new ListenerCollection(), makeContainer());

        expect(dispatcher.dispatchById(EventFixture.EVENT_ID, ['ignored'])).toBeInstanceOf(EventFixture);
    });

    it('dispatchById throws when the container resolves something that is not an event', () => {
        const container = new Container();

        container.bind('Not.An.Event', () => ({}));

        const dispatcher = new EventDispatcher(new ListenerCollection(), container);

        expect(() => dispatcher.dispatchById('Not.An.Event')).toThrow(EventInvalidEventException);
    });

    it('dispatchByIdIfHasListeners runs the listeners only when the event id has some', () => {
        const collection = new ListenerCollection();
        const dispatcher = new EventDispatcher(collection, makeContainer());

        const withoutListeners = dispatcher.dispatchByIdIfHasListeners(collectableEventId);

        expect(withoutListeners).toBeInstanceOf(DispatchCollectableEventFixture);
        expect((withoutListeners as DispatchCollectableEventFixture).getDispatches()).toStrictEqual([]);

        collection.addListener(makeListener('listener', collectableEventId));

        const withListeners = dispatcher.dispatchByIdIfHasListeners(collectableEventId);

        expect((withListeners as DispatchCollectableEventFixture).getDispatches()).toStrictEqual(['test']);
    });

    it('dispatchByIdIfHasListeners fills an arguments capable event when it has no listeners', () => {
        const dispatcher = new EventDispatcher(new ListenerCollection(), makeContainer());

        const event = dispatcher.dispatchByIdIfHasListeners(ArgumentsCapableEventFixture.EVENT_ID, ['first']);

        expect((event as ArgumentsCapableEventFixture).getArguments()).toStrictEqual(['first']);
    });

    it('a stoppable event stops the dispatcher before the next listener', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('first', StoppableEventFixture.EVENT_ID, 'one'));
        collection.addListener(makeListener('second', StoppableEventFixture.EVENT_ID, 'two'));
        collection.addListener(makeListener('third', StoppableEventFixture.EVENT_ID, 'three'));

        const dispatcher = new EventDispatcher(collection, makeContainer());
        const event = new StoppableEventFixture();

        expect(dispatcher.dispatch(event)).toBe(event);
        expect(event.getDispatches()).toStrictEqual(['one']);
    });

    it('a stoppable event that does not stop propagation runs every listener', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('first', StoppableEventFixture.EVENT_ID, 'one'));
        collection.addListener(makeListener('second', StoppableEventFixture.EVENT_ID, 'two'));
        collection.addListener(makeListener('third', StoppableEventFixture.EVENT_ID, 'three'));

        const dispatcher = new EventDispatcher(collection, makeContainer());
        const event = new StoppableEventFixture(false);

        dispatcher.dispatch(event);

        expect(event.getDispatches()).toStrictEqual(['one', 'two', 'three']);
    });

    it('dispatchListeners runs the listeners that it is given', () => {
        const dispatcher = new EventDispatcher(new ListenerCollection(), makeContainer());
        const event = new DispatchCollectableEventFixture();

        dispatcher.dispatchListeners(
            event,
            makeListener('first', collectableEventId, 'one'),
            makeListener('second', collectableEventId, 'two'),
        );

        expect(event.getDispatches()).toStrictEqual(['one', 'two']);
    });

    it('dispatchListener runs one listener', () => {
        const dispatcher = new EventDispatcher(new ListenerCollection(), makeContainer());
        const event = new DispatchCollectableEventFixture();

        expect(dispatcher.dispatchListener(event, makeListener('listener', collectableEventId))).toBe(event);
        expect(event.getDispatches()).toStrictEqual(['test']);
    });
});
