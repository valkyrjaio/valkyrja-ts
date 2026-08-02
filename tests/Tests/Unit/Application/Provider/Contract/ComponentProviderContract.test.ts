/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ComponentProviderContract } from '../../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';

describe('ComponentProviderContract', () => {
    it('instanceOf is true for an object exposing getComponentProviders', () => {
        expect(ComponentProviderContract.instanceOf({ getComponentProviders: (): [] => [] })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(ComponentProviderContract.instanceOf(null)).toBe(false);
        expect(ComponentProviderContract.instanceOf({})).toBe(false);
    });
});
