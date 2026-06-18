/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliInteractionConfigContract } from '../../../../../src/Valkyrja/Cli/Interaction/Data/Contract/CliInteractionConfigContract.ts';
import { InputContract } from '../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import { EmptyOutputContract } from '../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/EmptyOutputContract.ts';
import { FileOutputContract } from '../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/FileOutputContract.ts';
import { PlainOutputContract } from '../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/PlainOutputContract.ts';
import { StreamOutputContract } from '../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/StreamOutputContract.ts';
import { OutputFactoryContract } from '../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import { WriterContract } from '../../../../../src/Valkyrja/Cli/Interaction/Writer/Contract/WriterContract.ts';

describe('Cli Interaction contracts', () => {
    it.each([
        ['CliInteractionConfigContract', CliInteractionConfigContract, { isQuiet: false }],
        ['InputContract', InputContract, { getCaller: (): string => '' }],
        ['EmptyOutputContract', EmptyOutputContract, { getMessages: (): [] => [] }],
        ['FileOutputContract', FileOutputContract, { getFilepath: (): string => '' }],
        ['PlainOutputContract', PlainOutputContract, { getMessages: (): [] => [] }],
        ['StreamOutputContract', StreamOutputContract, { getStream: (): null => null }],
        ['OutputFactoryContract', OutputFactoryContract, { createOutput: (): null => null }],
        ['WriterContract', WriterContract, { write: (): null => null }],
    ])('%s.instanceOf distinguishes matching objects', (_name, contract, matching) => {
        expect(contract.instanceOf(matching)).toBe(true);
        expect(contract.instanceOf(null)).toBe(false);
        expect(contract.instanceOf({})).toBe(false);
    });
});
