/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliVersionCommandConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliVersionCommandConfigContract.ts';

describe('CliVersionCommandConfigContract', () => {
    it('instanceOf is true for an object exposing versionCommandName', () => {
        expect(CliVersionCommandConfigContract.instanceOf({ versionCommandName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliVersionCommandConfigContract.instanceOf(null)).toBe(false);
        expect(CliVersionCommandConfigContract.instanceOf({})).toBe(false);
    });
});
