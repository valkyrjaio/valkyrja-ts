/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableCaughtMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';

describe('ThrowableCaughtMiddlewareContract', () => {
    it('instanceOf is true for an object exposing throwableCaught', () => {
        expect(ThrowableCaughtMiddlewareContract.instanceOf({ throwableCaught: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ThrowableCaughtMiddlewareContract.instanceOf(null)).toBe(false);
        expect(ThrowableCaughtMiddlewareContract.instanceOf({})).toBe(false);
    });
});
