/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { FormatContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Format/Contract/FormatContract.ts';

describe('FormatContract', () => {
    it('instanceOf is true for an object exposing getSetCode', () => {
        expect(FormatContract.instanceOf({ getSetCode: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(FormatContract.instanceOf(null)).toBe(false);
        expect(FormatContract.instanceOf({})).toBe(false);
    });
});
