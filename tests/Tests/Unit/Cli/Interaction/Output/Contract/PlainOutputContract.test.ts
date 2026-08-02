/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { PlainOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/PlainOutputContract.ts';

describe('PlainOutputContract', () => {
    it('instanceOf is true for an object exposing getMessages', () => {
        expect(PlainOutputContract.instanceOf({ getMessages: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(PlainOutputContract.instanceOf(null)).toBe(false);
        expect(PlainOutputContract.instanceOf({})).toBe(false);
    });
});
