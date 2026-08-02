/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StreamOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/StreamOutputContract.ts';

describe('StreamOutputContract', () => {
    it('instanceOf is true for an object exposing getStream', () => {
        expect(StreamOutputContract.instanceOf({ getStream: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(StreamOutputContract.instanceOf(null)).toBe(false);
        expect(StreamOutputContract.instanceOf({})).toBe(false);
    });
});
