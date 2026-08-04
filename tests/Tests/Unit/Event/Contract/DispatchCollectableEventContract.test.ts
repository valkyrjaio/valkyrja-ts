/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { DispatchCollectableEventContract } from '../../../../../src/Valkyrja/Event/Contract/DispatchCollectableEventContract.ts';

import { DispatchCollectableEventFixture } from '../../../Fixtures/Event/DispatchCollectableEventFixture.ts';
import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';

describe('DispatchCollectableEventContract', () => {
    it('instanceOf is true for a dispatch collectable event', () => {
        expect(DispatchCollectableEventContract.instanceOf(new DispatchCollectableEventFixture())).toBe(true);
    });

    it('instanceOf is false for an event that collects nothing', () => {
        expect(DispatchCollectableEventContract.instanceOf(new EventFixture())).toBe(false);
    });

    it('instanceOf is false for non-events', () => {
        expect(DispatchCollectableEventContract.instanceOf(null)).toBe(false);
        expect(DispatchCollectableEventContract.instanceOf({ addDispatch: (): void => undefined })).toBe(false);
    });

    it('collects each dispatch in order', () => {
        const event = new DispatchCollectableEventFixture();

        expect(event.getDispatches()).toStrictEqual([]);

        event.addDispatch('first');
        event.addDispatch('second');

        expect(event.getDispatches()).toStrictEqual(['first', 'second']);
    });
});
