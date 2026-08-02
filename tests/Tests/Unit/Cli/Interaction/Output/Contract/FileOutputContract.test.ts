/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { FileOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/FileOutputContract.ts';

describe('FileOutputContract', () => {
    it('instanceOf is true for an object exposing getFilepath', () => {
        expect(FileOutputContract.instanceOf({ getFilepath: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(FileOutputContract.instanceOf(null)).toBe(false);
        expect(FileOutputContract.instanceOf({})).toBe(false);
    });
});
