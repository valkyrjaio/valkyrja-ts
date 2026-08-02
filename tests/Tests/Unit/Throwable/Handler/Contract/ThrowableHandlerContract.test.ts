/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableHandlerContract } from '../../../../../../src/Valkyrja/Throwable/Handler/Contract/ThrowableHandlerContract.ts';

describe('ThrowableHandlerContract', () => {
    it('instanceOf is true for an object exposing enable', () => {
        expect(ThrowableHandlerContract.instanceOf({ enable: (): void => {} })).toBe(true);
    });

    it('instanceOf is false for non-handlers', () => {
        expect(ThrowableHandlerContract.instanceOf(null)).toBe(false);
        expect(ThrowableHandlerContract.instanceOf({})).toBe(false);
    });
});
