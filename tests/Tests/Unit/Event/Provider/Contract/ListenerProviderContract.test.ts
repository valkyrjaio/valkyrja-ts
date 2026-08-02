/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ListenerProviderContract } from '../../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';

describe('ListenerProviderContract', () => {
    it('instanceOf is true for an object exposing getListeners', () => {
        expect(ListenerProviderContract.instanceOf({ getListeners: (): [] => [] })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(ListenerProviderContract.instanceOf(null)).toBe(false);
        expect(ListenerProviderContract.instanceOf({})).toBe(false);
    });
});
