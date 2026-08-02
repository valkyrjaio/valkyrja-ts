/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { OptionContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Option/Contract/OptionContract.ts';

describe('OptionContract', () => {
    it('instanceOf is true for an object exposing getName', () => {
        expect(OptionContract.instanceOf({ getName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(OptionContract.instanceOf(null)).toBe(false);
        expect(OptionContract.instanceOf({})).toBe(false);
    });
});
