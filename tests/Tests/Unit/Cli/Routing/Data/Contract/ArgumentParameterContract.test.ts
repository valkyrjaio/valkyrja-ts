/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ArgumentParameterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/ArgumentParameterContract.ts';

describe('ArgumentParameterContract', () => {
    it('instanceOf is true for an object exposing getMode', () => {
        expect(ArgumentParameterContract.instanceOf({ getMode: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ArgumentParameterContract.instanceOf(null)).toBe(false);
        expect(ArgumentParameterContract.instanceOf({})).toBe(false);
    });
});
