/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { InputReceivedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/InputReceivedMiddlewareContract.ts';

describe('InputReceivedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing inputReceived', () => {
        expect(InputReceivedMiddlewareContract.instanceOf({ inputReceived: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(InputReceivedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(InputReceivedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
