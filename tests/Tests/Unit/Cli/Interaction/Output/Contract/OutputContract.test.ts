/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { OutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

describe('OutputContract', () => {
    it('instanceOf is true for an object exposing getMessages', () => {
        expect(OutputContract.instanceOf({ getMessages: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(OutputContract.instanceOf(null)).toBe(false);
        expect(OutputContract.instanceOf({})).toBe(false);
    });
});
