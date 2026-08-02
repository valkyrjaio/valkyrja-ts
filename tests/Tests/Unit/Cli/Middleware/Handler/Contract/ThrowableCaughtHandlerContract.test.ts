/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableCaughtHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';

describe('ThrowableCaughtHandlerContract', () => {
    it('instanceOf is true for an object exposing throwableCaught', () => {
        expect(ThrowableCaughtHandlerContract.instanceOf({ throwableCaught: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ThrowableCaughtHandlerContract.instanceOf(null)).toBe(false);
        expect(ThrowableCaughtHandlerContract.instanceOf({})).toBe(false);
    });
});
