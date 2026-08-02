/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteNotMatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';

describe('RouteNotMatchedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing routeNotMatched', () => {
        expect(RouteNotMatchedMiddlewareContract.instanceOf({ routeNotMatched: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteNotMatchedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(RouteNotMatchedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
