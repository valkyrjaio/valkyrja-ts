/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { CheckForHelpOptionsMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckForHelpOptionsMiddleware.ts';
import { CheckForVersionOptionsMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckForVersionOptionsMiddleware.ts';
import { CheckGlobalInteractionOptionsMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckGlobalInteractionOptionsMiddleware.ts';
import { LogThrowableCaughtMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/ThrowableCaught/LogThrowableCaughtMiddleware.ts';
import { OutputThrowableCaughtMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/ThrowableCaught/OutputThrowableCaughtMiddleware.ts';

import type { InputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { LoggerContract } from '../../../../../../src/Valkyrja/Log/Logger/Contract/LoggerContract.ts';

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

const throwableHandler = {
    throwableCaught: (_input: InputContract, output: OutputContract): OutputContract => output,
} as unknown as ThrowableCaughtHandlerContract;

describe('Cli Server middleware', () => {
    it('CheckForVersionOptionsMiddleware rewrites the command when the version option is present', () => {
        const middleware = new CheckForVersionOptionsMiddleware('version', 'version', 'v');

        const matched = inputHandler();
        middleware.inputReceived(new Input('cli', 'build').withOptions(new Option('v')), matched.handler);
        expect(matched.received().getCommandName()).toBe('version');
        expect(matched.received().getOptions()).toHaveLength(0);

        const untouched = inputHandler();
        middleware.inputReceived(new Input('cli', 'build'), untouched.handler);
        expect(untouched.received().getCommandName()).toBe('build');
    });

    it('CheckForHelpOptionsMiddleware rewrites the command and records the original', () => {
        const middleware = new CheckForHelpOptionsMiddleware('help', 'help', 'h');

        const matched = inputHandler();
        middleware.inputReceived(new Input('cli', 'build').withOptions(new Option('help')), matched.handler);
        expect(matched.received().getCommandName()).toBe('help');
        expect(matched.received().getOption('command')[0]?.getValue()).toBe('build');

        const untouched = inputHandler();
        middleware.inputReceived(new Input('cli', 'build'), untouched.handler);
        expect(untouched.received().getCommandName()).toBe('build');
    });

    it('CheckGlobalInteractionOptionsMiddleware toggles config flags from options', () => {
        const config = new CliInteractionConfig();
        const middleware = new CheckGlobalInteractionOptionsMiddleware(
            config,
            'no-interaction',
            'N',
            'quiet',
            'q',
            'silent',
            's',
        );

        const input = new Input('cli', 'build').withOptions(new Option('N'), new Option('quiet'), new Option('s'));
        middleware.inputReceived(input, inputHandler().handler);

        expect(config.isInteractive).toBe(false);
        expect(config.isQuiet).toBe(true);
        expect(config.isSilent).toBe(true);
    });

    it('CheckGlobalInteractionOptionsMiddleware leaves config untouched without options', () => {
        const config = new CliInteractionConfig();
        const middleware = new CheckGlobalInteractionOptionsMiddleware(
            config,
            'no-interaction',
            'N',
            'quiet',
            'q',
            'silent',
            's',
        );

        middleware.inputReceived(new Input('cli', 'build'), inputHandler().handler);

        expect(config.isInteractive).toBe(true);
        expect(config.isQuiet).toBe(false);
        expect(config.isSilent).toBe(false);
    });

    it('OutputThrowableCaughtMiddleware renders an error output for an Error', () => {
        const middleware = new OutputThrowableCaughtMiddleware();

        const result = middleware.throwableCaught(
            new Input('cli', 'build'),
            new Output(),
            new Error('boom'),
            throwableHandler,
        );

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('OutputThrowableCaughtMiddleware renders an error output for a non-Error', () => {
        const middleware = new OutputThrowableCaughtMiddleware();

        const result = middleware.throwableCaught(new Input('cli', 'build'), new Output(), 'oops', throwableHandler);

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('LogThrowableCaughtMiddleware logs the throwable and continues the chain', () => {
        const logger = { throwable: vi.fn() } as unknown as LoggerContract;
        const middleware = new LogThrowableCaughtMiddleware(logger);

        middleware.throwableCaught(new Input('cli', 'build'), new Output(), new Error('boom'), throwableHandler);
        middleware.throwableCaught(new Input('cli', 'build'), new Output(), 'oops', throwableHandler);

        expect(logger.throwable).toHaveBeenCalledTimes(2);
    });
});
