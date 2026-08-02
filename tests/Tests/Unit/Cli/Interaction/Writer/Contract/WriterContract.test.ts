/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { WriterContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Writer/Contract/WriterContract.ts';

describe('WriterContract', () => {
    it('instanceOf is true for an object exposing write', () => {
        expect(WriterContract.instanceOf({ write: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(WriterContract.instanceOf(null)).toBe(false);
        expect(WriterContract.instanceOf({})).toBe(false);
    });
});
