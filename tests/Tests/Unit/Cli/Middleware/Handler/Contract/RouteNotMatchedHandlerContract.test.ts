/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteNotMatchedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';

describe('RouteNotMatchedHandlerContract', () => {
    it('instanceOf is true for an object exposing routeNotMatched', () => {
        expect(RouteNotMatchedHandlerContract.instanceOf({ routeNotMatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteNotMatchedHandlerContract.instanceOf(null)).toBe(false);
        expect(RouteNotMatchedHandlerContract.instanceOf({})).toBe(false);
    });
});
