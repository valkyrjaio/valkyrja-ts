/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ProgressContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/ProgressContract.ts';

describe('ProgressContract', () => {
    it('instanceOf is true for an object exposing isComplete', () => {
        expect(ProgressContract.instanceOf({ isComplete: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ProgressContract.instanceOf(null)).toBe(false);
        expect(ProgressContract.instanceOf({})).toBe(false);
    });
});
