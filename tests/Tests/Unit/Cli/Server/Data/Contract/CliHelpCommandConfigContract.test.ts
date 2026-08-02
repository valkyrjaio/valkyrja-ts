/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
