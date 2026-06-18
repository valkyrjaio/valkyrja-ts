/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliHelpCommandConfigContract } from '../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliHelpCommandConfigContract.ts';
import { CliNoInteractionConfigContract } from '../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliNoInteractionConfigContract.ts';
import { CliQuietInteractionConfigContract } from '../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliQuietInteractionConfigContract.ts';
import { CliSilentInteractionConfigContract } from '../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliSilentInteractionConfigContract.ts';
import { CliVersionCommandConfigContract } from '../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliVersionCommandConfigContract.ts';

describe('Cli Server config contracts', () => {
    it.each([
        ['CliHelpCommandConfigContract', CliHelpCommandConfigContract, { helpCommandName: 'help' }],
        ['CliNoInteractionConfigContract', CliNoInteractionConfigContract, { noInteractionOptionName: 'no' }],
        ['CliQuietInteractionConfigContract', CliQuietInteractionConfigContract, { quietOptionName: 'quiet' }],
        ['CliSilentInteractionConfigContract', CliSilentInteractionConfigContract, { silentOptionName: 'silent' }],
        ['CliVersionCommandConfigContract', CliVersionCommandConfigContract, { versionCommandName: 'version' }],
    ])('%s.instanceOf distinguishes matching objects', (_name, contract, matching) => {
        expect(contract.instanceOf(matching)).toBe(true);
        expect(contract.instanceOf(null)).toBe(false);
        expect(contract.instanceOf({})).toBe(false);
    });
});
