/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { PublishableComponentProviderContract } from '../../../../../../src/Valkyrja/Application/Provider/Contract/PublishableComponentProviderContract.ts';

describe('PublishableComponentProviderContract', () => {
    it('instanceOf is true for an object exposing publish', () => {
        expect(PublishableComponentProviderContract.instanceOf({ publish: (): void => {} })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(PublishableComponentProviderContract.instanceOf(null)).toBe(false);
        expect(PublishableComponentProviderContract.instanceOf({})).toBe(false);
    });
});
