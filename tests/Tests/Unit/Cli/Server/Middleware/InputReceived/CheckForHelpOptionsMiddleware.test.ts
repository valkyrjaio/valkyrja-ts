/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Input } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Option } from '../../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { CheckForHelpOptionsMiddleware } from '../../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckForHelpOptionsMiddleware.ts';

import type { InputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';

function inputHandler(): { handler: InputReceivedHandlerContract; received: () => InputContract } {
    let last: InputContract | undefined;
    const handler = {
        inputReceived: (input: InputContract): InputContract => {
            last = input;

            return input;
        },
    } as unknown as InputReceivedHandlerContract;

    return { handler, received: () => last as InputContract };
}

describe('CheckForHelpOptionsMiddleware', () => {
    it('rewrites the command and records the original when the help option is present', () => {
        const matched = inputHandler();
        new CheckForHelpOptionsMiddleware('help', 'help', 'h').inputReceived(
            new Input('cli', 'build').withOptions(new Option('help')),
            matched.handler,
        );

        expect(matched.received().getCommandName()).toBe('help');
        expect(matched.received().getOption('command')[0]?.getValue()).toBe('build');
    });

    it('leaves the input untouched without the help option', () => {
        const untouched = inputHandler();
        new CheckForHelpOptionsMiddleware('help', 'help', 'h').inputReceived(
            new Input('cli', 'build'),
            untouched.handler,
        );

        expect(untouched.received().getCommandName()).toBe('build');
    });
});
