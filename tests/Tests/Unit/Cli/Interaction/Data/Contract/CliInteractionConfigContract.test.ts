/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Data/Contract/CliInteractionConfigContract.ts';

describe('CliInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing isQuiet', () => {
        expect(CliInteractionConfigContract.instanceOf({ isQuiet: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
