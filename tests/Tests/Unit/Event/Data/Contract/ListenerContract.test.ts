/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ListenerContract } from '../../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

describe('ListenerContract', () => {
    it('instanceOf is true for an object exposing getEventId', () => {
        expect(ListenerContract.instanceOf({ getEventId: (): string => 'x' })).toBe(true);
    });

    it('instanceOf is false for non-listeners', () => {
        expect(ListenerContract.instanceOf(null)).toBe(false);
        expect(ListenerContract.instanceOf({})).toBe(false);
        expect(ListenerContract.instanceOf('listener')).toBe(false);
    });
});
