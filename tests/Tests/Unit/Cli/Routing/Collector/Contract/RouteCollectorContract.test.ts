/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollectorContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Collector/Contract/RouteCollectorContract.ts';

describe('RouteCollectorContract', () => {
    it('instanceOf is true for an object exposing getRoutes', () => {
        expect(RouteCollectorContract.instanceOf({ getRoutes: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteCollectorContract.instanceOf(null)).toBe(false);
        expect(RouteCollectorContract.instanceOf({})).toBe(false);
    });
});
