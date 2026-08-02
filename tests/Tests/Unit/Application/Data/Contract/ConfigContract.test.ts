/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ConfigContract } from '../../../../../../src/Valkyrja/Application/Data/Contract/ConfigContract.ts';

describe('ConfigContract', () => {
    it('instanceOf is true for an object exposing namespace', () => {
        expect(ConfigContract.instanceOf({ namespace: 'App' })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(ConfigContract.instanceOf(null)).toBe(false);
        expect(ConfigContract.instanceOf({})).toBe(false);
    });
});
