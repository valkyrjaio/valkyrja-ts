/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { InputReceivedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';

describe('InputReceivedHandlerContract', () => {
    it('instanceOf is true for an object exposing inputReceived', () => {
        expect(InputReceivedHandlerContract.instanceOf({ inputReceived: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(InputReceivedHandlerContract.instanceOf(null)).toBe(false);
        expect(InputReceivedHandlerContract.instanceOf({})).toBe(false);
    });
});
