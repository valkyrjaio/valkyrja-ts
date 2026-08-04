/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ArgumentsCapableEventContract } from '../../../../../src/Valkyrja/Event/Contract/ArgumentsCapableEventContract.ts';

import { ArgumentsCapableEventFixture } from '../../../Fixtures/Event/ArgumentsCapableEventFixture.ts';
import { EventFixture } from '../../../Fixtures/Event/EventFixture.ts';

describe('ArgumentsCapableEventContract', () => {
    it('instanceOf is true for an arguments capable event', () => {
        expect(ArgumentsCapableEventContract.instanceOf(new ArgumentsCapableEventFixture())).toBe(true);
    });

    it('instanceOf is false for an event that takes no arguments', () => {
        expect(ArgumentsCapableEventContract.instanceOf(new EventFixture())).toBe(false);
    });

    it('instanceOf is false for non-events', () => {
        expect(ArgumentsCapableEventContract.instanceOf(null)).toBe(false);
        expect(ArgumentsCapableEventContract.instanceOf({ setArguments: (): null => null })).toBe(false);
    });

    it('holds the arguments that it was given', () => {
        const event = new ArgumentsCapableEventFixture();

        expect(event.getArguments()).toStrictEqual([]);
        expect(event.setArguments(['first', 'second'])).toBe(event);
        expect(event.getArguments()).toStrictEqual(['first', 'second']);
    });
});
