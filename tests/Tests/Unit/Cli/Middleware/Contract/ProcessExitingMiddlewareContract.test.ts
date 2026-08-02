/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ProcessExitingMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/ProcessExitingMiddlewareContract.ts';

describe('ProcessExitingMiddlewareContract', () => {
    it('instanceOf is true for an object exposing processExiting', () => {
        expect(ProcessExitingMiddlewareContract.instanceOf({ processExiting: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ProcessExitingMiddlewareContract.instanceOf(null)).toBe(false);
        expect(ProcessExitingMiddlewareContract.instanceOf({})).toBe(false);
    });
});
