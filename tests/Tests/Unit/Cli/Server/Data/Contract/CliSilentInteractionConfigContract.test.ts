/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliSilentInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliSilentInteractionConfigContract.ts';

describe('CliSilentInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing silentOptionName', () => {
        expect(CliSilentInteractionConfigContract.instanceOf({ silentOptionName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliSilentInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliSilentInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
