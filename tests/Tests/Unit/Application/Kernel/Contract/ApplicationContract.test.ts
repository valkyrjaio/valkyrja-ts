/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('ApplicationContract', () => {
    it('instanceOf is true for an object exposing getContainer', () => {
        expect(ApplicationContract.instanceOf({ getContainer: (): null => null })).toBe(true);
    });

    it('instanceOf is false for non-applications', () => {
        expect(ApplicationContract.instanceOf(null)).toBe(false);
        expect(ApplicationContract.instanceOf({})).toBe(false);
    });
});
