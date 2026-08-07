/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventServiceId } from '../../../../../src/Valkyrja/Event/Constant/EventServiceId.ts';

describe('EventServiceId', () => {
    it('exposes the EventData service id', () => {
        expect(EventServiceId.EventData).toBe('Valkyrja.Event.Data.EventData');
    });

    it('exposes the listener collection service id', () => {
        expect(EventServiceId.ListenerCollectionContract).toBe('Valkyrja.Event.Collection.ListenerCollectionContract');
    });

    it('exposes the event dispatcher service id', () => {
        expect(EventServiceId.EventDispatcherContract).toBe('Valkyrja.Event.Dispatcher.EventDispatcherContract');
    });
});
