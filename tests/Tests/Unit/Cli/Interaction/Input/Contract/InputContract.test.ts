/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { InputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';

describe('InputContract', () => {
    it('instanceOf is true for an object exposing getCaller', () => {
        expect(InputContract.instanceOf({ getCaller: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(InputContract.instanceOf(null)).toBe(false);
        expect(InputContract.instanceOf({})).toBe(false);
    });
});
