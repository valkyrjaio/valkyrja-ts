/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliRouteProviderContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';

describe('CliRouteProviderContract', () => {
    it('instanceOf is true for an object exposing getRoutes', () => {
        expect(CliRouteProviderContract.instanceOf({ getRoutes: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliRouteProviderContract.instanceOf(null)).toBe(false);
        expect(CliRouteProviderContract.instanceOf({})).toBe(false);
    });
});
