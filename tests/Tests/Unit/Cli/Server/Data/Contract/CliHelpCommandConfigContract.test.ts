/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliHelpCommandConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliHelpCommandConfigContract.ts';

describe('CliHelpCommandConfigContract', () => {
    it('instanceOf is true for an object exposing helpCommandName', () => {
        expect(CliHelpCommandConfigContract.instanceOf({ helpCommandName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliHelpCommandConfigContract.instanceOf(null)).toBe(false);
        expect(CliHelpCommandConfigContract.instanceOf({})).toBe(false);
    });
});
