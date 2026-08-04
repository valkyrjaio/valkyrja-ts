/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ListenerCollection } from '../../../../../src/Valkyrja/Event/Collection/ListenerCollection.ts';
import { EventData } from '../../../../../src/Valkyrja/Event/Data/EventData.ts';
import { Listener } from '../../../../../src/Valkyrja/Event/Data/Listener.ts';

import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';

import type {
    ListenerContract,
    ListenerHandler,
} from '../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

const eventId = EventFixture.EVENT_ID;
const handler: ListenerHandler = () => null;

const makeListener = (name: string, forEventId: string = eventId): ListenerContract =>
    new Listener(forEventId, name, handler);

const namesOf = (listeners: ListenerContract[]): string[] => listeners.map((listener) => listener.getName());

describe('ListenerCollection', () => {
    it('starts empty', () => {
        const collection = new ListenerCollection();

        const data = collection.getData();

        expect(data.events).toStrictEqual({});
        expect(data.listeners).toStrictEqual({});
        expect(collection.getListeners()).toStrictEqual([]);
        expect(collection.getEvents()).toStrictEqual([]);
        expect(collection.getEventsWithListeners()).toStrictEqual({});
    });

    it('records one listener under its own name and event', () => {
        const collection = new ListenerCollection();
        const event = new EventFixture();
        const listener = makeListener('listener');

        collection.addListener(listener);

        const data = collection.getData();

        expect(data.events).toStrictEqual({ [eventId]: ['listener'] });
        expect(Object.keys(data.listeners)).toStrictEqual(['listener']);
        expect(data.listeners['listener']?.()).toBe(listener);
        expect(collection.getListeners()).toStrictEqual([listener]);
        expect(collection.getEvents()).toStrictEqual([eventId]);
        expect(collection.getEventsWithListeners()).toStrictEqual({ [eventId]: [listener] });
        expect(collection.getListenersForEvent(event)).toStrictEqual([listener]);
        expect(collection.getListenersForEventById(eventId)).toStrictEqual([listener]);
    });

    // Three listeners, not two: with two, a collection that reverses the order still
    // passes half the time under a naive assertion, and a set-based collection that
    // orders by name would pass outright.
    it('runs the listeners for one event in the order that they were added', () => {
        const collection = new ListenerCollection();
        const event = new EventFixture();

        collection.addListener(makeListener('charlie'));
        collection.addListener(makeListener('alpha'));
        collection.addListener(makeListener('bravo'));

        expect(namesOf(collection.getListenersForEvent(event))).toStrictEqual(['charlie', 'alpha', 'bravo']);
        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['charlie', 'alpha', 'bravo']);
        expect(namesOf(collection.getListeners())).toStrictEqual(['charlie', 'alpha', 'bravo']);
        expect(collection.getData().events[eventId]).toStrictEqual(['charlie', 'alpha', 'bravo']);
    });

    // A JavaScript object reorders a key that reads as an integer, so an object-backed
    // collection would run `1` first. The collection holds a Map for this reason.
    it('keeps the recorded order for a listener whose name reads as an integer', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('charlie'));
        collection.addListener(makeListener('1'));
        collection.addListener(makeListener('bravo'));

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['charlie', '1', 'bravo']);
        expect(namesOf(collection.getListeners())).toStrictEqual(['charlie', '1', 'bravo']);
    });

    it('keeps the recorded order after a listener in the middle is removed and added again', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('first'));
        collection.addListener(makeListener('second'));
        collection.addListener(makeListener('third'));

        collection.removeListenerById('second');

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['first', 'third']);

        collection.addListener(makeListener('second'));

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['first', 'third', 'second']);
    });

    it('replaces a listener of the same name and keeps its position', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('first'));
        collection.addListener(makeListener('second'));
        collection.addListener(makeListener('third'));

        const replacement = makeListener('second');

        collection.addListener(replacement);

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['first', 'second', 'third']);
        expect(collection.getListenersForEventById(eventId)[1]).toBe(replacement);
    });

    it('records the listeners of several events separately', () => {
        const collection = new ListenerCollection();
        const otherEventId = 'Valkyrja.Tests.Fixtures.Event.OtherEvent';

        collection.addListener(makeListener('first'));
        collection.addListener(makeListener('second', otherEventId));

        expect(collection.getEvents()).toStrictEqual([eventId, otherEventId]);
        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['first']);
        expect(namesOf(collection.getListenersForEventById(otherEventId))).toStrictEqual(['second']);
    });

    it('reports an unknown event as having no listeners', () => {
        const collection = new ListenerCollection();

        expect(collection.hasListenersForEventById('Unknown.Event')).toBe(false);
        expect(collection.getListenersForEventById('Unknown.Event')).toStrictEqual([]);
    });

    it('reports an event whose listeners were all removed as having no listeners', () => {
        const collection = new ListenerCollection();
        const listener = makeListener('listener');

        collection.addListener(listener);
        collection.removeListener(listener);

        expect(collection.hasListenersForEventById(eventId)).toBe(false);
        expect(collection.getListenersForEventById(eventId)).toStrictEqual([]);
    });

    it('skips a listener name that it holds no factory for', () => {
        const collection = new ListenerCollection();
        const listener = makeListener('listener');

        collection.setFromData(new EventData({ [eventId]: ['listener', 'missing'] }, { listener: () => listener }));

        expect(collection.getListenersForEventById(eventId)).toStrictEqual([listener]);
    });

    it('removing a listener for an event it was never recorded under leaves the collection alone', () => {
        const collection = new ListenerCollection();
        const listener = makeListener('listener');

        collection.addListener(listener);
        collection.removeListener(makeListener('listener', 'Unrecorded.Event'));

        expect(collection.hasListenerById('listener')).toBe(false);
        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual([]);
    });

    it('removing an unknown listener name leaves the collection alone', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('listener'));
        collection.removeListenerById('unknown');

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['listener']);
    });

    it('the data that getData returns does not change when the collection does', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('first'));

        const data = collection.getData();

        collection.addListener(makeListener('second'));

        expect(data.events[eventId]).toStrictEqual(['first']);
        expect(collection.getData().events[eventId]).toStrictEqual(['first', 'second']);
    });

    it('setFromData replaces the state and keeps the recorded order', () => {
        const collection = new ListenerCollection();
        const first = makeListener('first');
        const second = makeListener('second');
        const third = makeListener('third');

        collection.setFromData(
            new EventData(
                { [eventId]: ['third', 'first', 'second'] },
                { first: () => first, second: () => second, third: () => third },
            ),
        );

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['third', 'first', 'second']);
        expect(collection.hasListenerById('first')).toBe(true);
        expect(collection.getEvents()).toStrictEqual([eventId]);
    });

    it('setFromData does not share the arrays of the data it was given', () => {
        const collection = new ListenerCollection();
        const listener = makeListener('first');
        const data = new EventData({ [eventId]: ['first'] }, { first: () => listener });

        collection.setFromData(data);
        collection.addListener(makeListener('second'));

        expect(data.events[eventId]).toStrictEqual(['first']);
    });

    it('setFromData with empty data empties the collection', () => {
        const collection = new ListenerCollection();

        collection.addListener(makeListener('listener'));
        collection.setFromData(new EventData());

        expect(collection.getListeners()).toStrictEqual([]);
        expect(collection.getEvents()).toStrictEqual([]);
        expect(collection.getEventsWithListeners()).toStrictEqual({});
    });

    it('adds and removes a listener by value and by id', () => {
        const collection = new ListenerCollection();
        const event = new EventFixture();
        const listener = makeListener('listener');

        expect(collection.hasListener(listener)).toBe(false);
        expect(collection.hasListenerById('listener')).toBe(false);
        expect(collection.hasListenersForEvent(event)).toBe(false);
        expect(collection.hasListenersForEventById(eventId)).toBe(false);

        collection.addListener(listener);

        expect(collection.hasListener(listener)).toBe(true);
        expect(collection.hasListenerById('listener')).toBe(true);
        expect(collection.hasListenersForEvent(event)).toBe(true);
        expect(collection.hasListenersForEventById(eventId)).toBe(true);

        collection.removeListener(listener);

        expect(collection.hasListener(listener)).toBe(false);
        expect(collection.hasListenersForEvent(event)).toBe(false);

        collection.addListener(listener);
        collection.removeListenerById('listener');

        expect(collection.hasListenerById('listener')).toBe(false);
        expect(collection.hasListenersForEventById(eventId)).toBe(false);
    });

    it('sets and removes the listeners of an event', () => {
        const collection = new ListenerCollection();
        const event = new EventFixture();
        const listener = makeListener('listener', 'Some.Other.Event');

        collection.setListenersForEvent(event, listener);

        expect(collection.hasListenerById('listener')).toBe(true);
        expect(collection.hasListenersForEvent(event)).toBe(true);
        expect(collection.getListenersForEvent(event)[0]?.getEventId()).toBe(eventId);

        collection.removeListenersForEvent(event);

        expect(collection.hasListenerById('listener')).toBe(false);
        expect(collection.hasListenersForEvent(event)).toBe(false);
        expect(collection.getEvents()).toStrictEqual([]);
    });

    it('sets and removes the listeners of an event id', () => {
        const collection = new ListenerCollection();

        collection.setListenersForEventById(eventId, makeListener('first'), makeListener('second'));

        expect(namesOf(collection.getListenersForEventById(eventId))).toStrictEqual(['first', 'second']);

        collection.removeListenersForEventById(eventId);

        expect(collection.hasListenerById('first')).toBe(false);
        expect(collection.hasListenerById('second')).toBe(false);
        expect(collection.getEvents()).toStrictEqual([]);
    });

    it('getEventsWithListeners returns each event with its own listeners in order', () => {
        const collection = new ListenerCollection();
        const otherEventId = 'Valkyrja.Tests.Fixtures.Event.OtherEvent';

        collection.addListener(makeListener('first'));
        collection.addListener(makeListener('second'));
        collection.addListener(makeListener('third', otherEventId));

        const eventsWithListeners = collection.getEventsWithListeners();

        expect(Object.keys(eventsWithListeners)).toStrictEqual([eventId, otherEventId]);
        expect(namesOf(eventsWithListeners[eventId] ?? [])).toStrictEqual(['first', 'second']);
        expect(namesOf(eventsWithListeners[otherEventId] ?? [])).toStrictEqual(['third']);
    });
});
