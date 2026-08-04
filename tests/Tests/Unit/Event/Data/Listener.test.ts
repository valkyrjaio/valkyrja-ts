/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Listener } from '../../../../../src/Valkyrja/Event/Data/Listener.ts';

import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';

import type { ListenerHandler } from '../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

const handler: ListenerHandler = () => null;

describe('Listener', () => {
    it('withEventId returns a copy with the new event id', () => {
        const listener = new Listener(EventFixture.EVENT_ID, 'test', handler);

        expect(listener.getEventId()).toBe(EventFixture.EVENT_ID);

        const copy = listener.withEventId('another-event-id');

        expect(copy).not.toBe(listener);
        expect(copy.getEventId()).toBe('another-event-id');
        expect(listener.getEventId()).toBe(EventFixture.EVENT_ID);
    });

    it('withName returns a copy with the new name', () => {
        const listener = new Listener(EventFixture.EVENT_ID, 'test', handler);

        expect(listener.getName()).toBe('test');

        const copy = listener.withName('test2');

        expect(copy).not.toBe(listener);
        expect(copy.getName()).toBe('test2');
        expect(listener.getName()).toBe('test');
    });

    it('withHandler returns a copy with the new handler', () => {
        const listener = new Listener(EventFixture.EVENT_ID, 'test', handler);

        expect(listener.getHandler()).toBe(handler);

        const handler2: ListenerHandler = () => 'string';
        const copy = listener.withHandler(handler2);

        expect(copy).not.toBe(listener);
        expect(copy.getHandler()).toBe(handler2);
        expect(listener.getHandler()).toBe(handler);
    });

    it('a copy keeps every other property', () => {
        const listener = new Listener(EventFixture.EVENT_ID, 'test', handler);

        const copy = listener.withName('test2');

        expect(copy.getEventId()).toBe(EventFixture.EVENT_ID);
        expect(copy.getHandler()).toBe(handler);
    });
});
