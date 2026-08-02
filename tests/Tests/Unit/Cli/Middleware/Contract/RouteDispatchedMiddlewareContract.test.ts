/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteDispatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';

describe('RouteDispatchedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing routeDispatched', () => {
        expect(RouteDispatchedMiddlewareContract.instanceOf({ routeDispatched: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteDispatchedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(RouteDispatchedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
