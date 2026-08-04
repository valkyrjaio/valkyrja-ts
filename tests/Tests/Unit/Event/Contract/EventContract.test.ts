/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventContract } from '../../../../../src/Valkyrja/Event/Contract/EventContract.ts';

import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';

describe('EventContract', () => {
    it('instanceOf is true for an event', () => {
        expect(EventContract.instanceOf(new EventFixture())).toBe(true);
    });

    it('instanceOf is false for non-events', () => {
        expect(EventContract.instanceOf(null)).toBe(false);
        expect(EventContract.instanceOf({})).toBe(false);
        expect(EventContract.instanceOf('event')).toBe(false);
    });

    it('an event reports its own id', () => {
        expect(new EventFixture().getEventId()).toBe(EventFixture.EVENT_ID);
    });
});
