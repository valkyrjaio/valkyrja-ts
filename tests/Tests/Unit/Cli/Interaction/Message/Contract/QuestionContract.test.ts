/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { QuestionContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/QuestionContract.ts';

describe('QuestionContract', () => {
    it('instanceOf is true for an object exposing ask', () => {
        expect(QuestionContract.instanceOf({ ask: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(QuestionContract.instanceOf(null)).toBe(false);
        expect(QuestionContract.instanceOf({})).toBe(false);
    });
});
