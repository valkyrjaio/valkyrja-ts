/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Input } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Option } from '../../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { CheckForVersionOptionsMiddleware } from '../../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckForVersionOptionsMiddleware.ts';

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

describe('CheckForVersionOptionsMiddleware', () => {
    it('rewrites the command and clears options when the version option is present', () => {
        const matched = inputHandler();
        new CheckForVersionOptionsMiddleware('version', 'version', 'v').inputReceived(
            new Input('cli', 'build').withOptions(new Option('v')),
            matched.handler,
        );

        expect(matched.received().getCommandName()).toBe('version');
        expect(matched.received().getOptions()).toHaveLength(0);
    });

    it('leaves the input untouched without the version option', () => {
        const untouched = inputHandler();
        new CheckForVersionOptionsMiddleware('version', 'version', 'v').inputReceived(
            new Input('cli', 'build'),
            untouched.handler,
        );

        expect(untouched.received().getCommandName()).toBe('build');
    });
});
