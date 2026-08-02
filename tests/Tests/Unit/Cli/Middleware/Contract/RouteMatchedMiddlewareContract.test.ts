/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteMatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteMatchedMiddlewareContract.ts';

describe('RouteMatchedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing routeMatched', () => {
        expect(RouteMatchedMiddlewareContract.instanceOf({ routeMatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteMatchedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(RouteMatchedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
