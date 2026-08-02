/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ServiceProviderContract } from '../../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

describe('ServiceProviderContract', () => {
    it('instanceOf is true for an object exposing publishers', () => {
        expect(ServiceProviderContract.instanceOf({ publishers: {} })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(ServiceProviderContract.instanceOf(null)).toBe(false);
        expect(ServiceProviderContract.instanceOf({})).toBe(false);
    });
});
