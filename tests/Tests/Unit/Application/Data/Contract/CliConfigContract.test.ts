/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliConfigContract } from '../../../../../../src/Valkyrja/Application/Data/Contract/CliConfigContract.ts';

describe('CliConfigContract', () => {
    it('instanceOf is true for an object exposing applicationName', () => {
        expect(CliConfigContract.instanceOf({ applicationName: 'app' })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(CliConfigContract.instanceOf(null)).toBe(false);
        expect(CliConfigContract.instanceOf({})).toBe(false);
    });
});
