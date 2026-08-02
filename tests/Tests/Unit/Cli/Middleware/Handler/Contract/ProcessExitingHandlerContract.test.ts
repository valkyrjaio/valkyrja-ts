/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ProcessExitingHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';

describe('ProcessExitingHandlerContract', () => {
    it('instanceOf is true for an object exposing processExiting', () => {
        expect(ProcessExitingHandlerContract.instanceOf({ processExiting: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ProcessExitingHandlerContract.instanceOf(null)).toBe(false);
        expect(ProcessExitingHandlerContract.instanceOf({})).toBe(false);
    });
});
