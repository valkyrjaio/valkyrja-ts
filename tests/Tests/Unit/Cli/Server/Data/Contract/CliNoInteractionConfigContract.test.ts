/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliNoInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliNoInteractionConfigContract.ts';

describe('CliNoInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing noInteractionOptionName', () => {
        expect(CliNoInteractionConfigContract.instanceOf({ noInteractionOptionName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliNoInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliNoInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
