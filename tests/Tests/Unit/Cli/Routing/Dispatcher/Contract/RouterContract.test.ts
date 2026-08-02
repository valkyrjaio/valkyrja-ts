/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

describe('RouterContract', () => {
    it('instanceOf is true for an object exposing dispatch', () => {
        expect(RouterContract.instanceOf({ dispatch: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouterContract.instanceOf(null)).toBe(false);
        expect(RouterContract.instanceOf({})).toBe(false);
    });
});
