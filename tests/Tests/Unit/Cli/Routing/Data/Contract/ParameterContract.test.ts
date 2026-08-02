/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ParameterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/ParameterContract.ts';

describe('ParameterContract', () => {
    it('instanceOf is true for an object exposing getName', () => {
        expect(ParameterContract.instanceOf({ getName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ParameterContract.instanceOf(null)).toBe(false);
        expect(ParameterContract.instanceOf({})).toBe(false);
    });
});
