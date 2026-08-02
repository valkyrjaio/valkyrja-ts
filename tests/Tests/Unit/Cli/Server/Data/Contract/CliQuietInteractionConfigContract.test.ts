/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliQuietInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliQuietInteractionConfigContract.ts';

describe('CliQuietInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing quietOptionName', () => {
        expect(CliQuietInteractionConfigContract.instanceOf({ quietOptionName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliQuietInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliQuietInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
