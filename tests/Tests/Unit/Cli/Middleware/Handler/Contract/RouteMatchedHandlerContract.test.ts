/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteMatchedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';

describe('RouteMatchedHandlerContract', () => {
    it('instanceOf is true for an object exposing routeMatched', () => {
        expect(RouteMatchedHandlerContract.instanceOf({ routeMatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteMatchedHandlerContract.instanceOf(null)).toBe(false);
        expect(RouteMatchedHandlerContract.instanceOf({})).toBe(false);
    });
});
