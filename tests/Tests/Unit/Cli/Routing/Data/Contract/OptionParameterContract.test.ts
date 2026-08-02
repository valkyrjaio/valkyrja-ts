/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { OptionParameterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/OptionParameterContract.ts';

describe('OptionParameterContract', () => {
    it('instanceOf is true for an object exposing getShortNames', () => {
        expect(OptionParameterContract.instanceOf({ getShortNames: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(OptionParameterContract.instanceOf(null)).toBe(false);
        expect(OptionParameterContract.instanceOf({})).toBe(false);
    });
});
