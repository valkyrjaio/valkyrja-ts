/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/HandlerContract.ts';

describe('HandlerContract', () => {
    it('instanceOf is true for an object exposing add', () => {
        expect(HandlerContract.instanceOf({ add: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(HandlerContract.instanceOf(null)).toBe(false);
        expect(HandlerContract.instanceOf({})).toBe(false);
    });
});
