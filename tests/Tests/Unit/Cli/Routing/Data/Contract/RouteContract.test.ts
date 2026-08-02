/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

describe('RouteContract', () => {
    it('instanceOf is true for an object exposing getName', () => {
        expect(RouteContract.instanceOf({ getName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteContract.instanceOf(null)).toBe(false);
        expect(RouteContract.instanceOf({})).toBe(false);
    });
});
