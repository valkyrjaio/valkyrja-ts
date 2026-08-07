/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StoppableEventContract } from '../../../../../src/Valkyrja/Event/Contract/StoppableEventContract.ts';

import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';
import { StoppableEventFixture } from '../../../Fixtures/Event/StoppableEventFixture.ts';

describe('StoppableEventContract', () => {
    it('instanceOf is true for a stoppable event', () => {
        expect(StoppableEventContract.instanceOf(new StoppableEventFixture())).toBe(true);
    });

    it('instanceOf is false for an event that does not stop propagation', () => {
        expect(StoppableEventContract.instanceOf(new EventFixture())).toBe(false);
    });

    it('instanceOf is false for non-events', () => {
        expect(StoppableEventContract.instanceOf(null)).toBe(false);
        expect(StoppableEventContract.instanceOf({ isPropagationStopped: (): boolean => true })).toBe(false);
    });

    it('reports the propagation state that it was built with', () => {
        expect(new StoppableEventFixture().isPropagationStopped()).toBe(true);
        expect(new StoppableEventFixture(false).isPropagationStopped()).toBe(false);
    });
});
