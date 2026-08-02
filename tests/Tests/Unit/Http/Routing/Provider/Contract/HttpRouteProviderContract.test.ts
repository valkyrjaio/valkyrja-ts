/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpRouteProviderContract } from '../../../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

describe('HttpRouteProviderContract', () => {
    it('instanceOf is true for an object exposing getRoutes', () => {
        expect(HttpRouteProviderContract.instanceOf({ getRoutes: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(HttpRouteProviderContract.instanceOf(null)).toBe(false);
        expect(HttpRouteProviderContract.instanceOf({})).toBe(false);
    });
});
