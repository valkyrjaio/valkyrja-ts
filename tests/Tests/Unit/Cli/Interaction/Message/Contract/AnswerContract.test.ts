/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AnswerContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/AnswerContract.ts';

describe('AnswerContract', () => {
    it('instanceOf is true for an object exposing getUserResponse', () => {
        expect(AnswerContract.instanceOf({ getUserResponse: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(AnswerContract.instanceOf(null)).toBe(false);
        expect(AnswerContract.instanceOf({})).toBe(false);
    });
});
