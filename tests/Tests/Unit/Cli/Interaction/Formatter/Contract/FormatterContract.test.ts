/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { FormatterContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Formatter/Contract/FormatterContract.ts';

describe('FormatterContract', () => {
    it('instanceOf is true for an object exposing formatText', () => {
        expect(FormatterContract.instanceOf({ formatText: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(FormatterContract.instanceOf(null)).toBe(false);
        expect(FormatterContract.instanceOf({})).toBe(false);
    });
});
