/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteDispatchedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';

describe('RouteDispatchedHandlerContract', () => {
    it('instanceOf is true for an object exposing routeDispatched', () => {
        expect(RouteDispatchedHandlerContract.instanceOf({ routeDispatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteDispatchedHandlerContract.instanceOf(null)).toBe(false);
        expect(RouteDispatchedHandlerContract.instanceOf({})).toBe(false);
    });
});
