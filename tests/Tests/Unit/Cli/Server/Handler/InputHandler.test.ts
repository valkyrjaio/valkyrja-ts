/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { InputHandler } from '../../../../../../src/Valkyrja/Cli/Server/Handler/InputHandler.ts';
import { CliInteractionServiceId } from '../../../../../../src/Valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { Exiter } from '../../../../../../src/Valkyrja/Cli/Server/Support/Exiter.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { InputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ProcessExitingHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

const passInput = { inputReceived: (input: InputContract): InputContract => input } as InputReceivedHandlerContract;
const passThrowable = {
    throwableCaught: (_input: InputContract, output: OutputContract): OutputContract => output,
} as ThrowableCaughtHandlerContract;

function build(overrides: {
    router?: RouterContract;
    inputReceivedHandler?: InputReceivedHandlerContract;
    processExitingHandler?: ProcessExitingHandlerContract;
}): { handler: InputHandler; container: Container } {
    const container = new Container();
    const handler = new InputHandler(
        container,
        overrides.router ?? ({ dispatch: () => new Output() } as unknown as RouterContract),
        overrides.inputReceivedHandler ?? passInput,
        passThrowable,
        overrides.processExitingHandler ?? ({ processExiting: vi.fn() } as unknown as ProcessExitingHandlerContract),
        new CliInteractionConfig(),
        new OutputFactory(),
    );

    return { handler, container };
}

beforeAll(() => Exiter.freeze());
afterAll(() => Exiter.unfreeze());
afterEach(() => stdoutSpy.mockClear());

describe('InputHandler', () => {
    it('dispatches the router and stores the output', () => {
        const output = new Output();
        const { handler, container } = build({ router: { dispatch: () => output } as unknown as RouterContract });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result).toBe(output);
        expect(container.getSingleton(CliInteractionServiceId.OutputContract)).toBe(output);
    });

    it('short-circuits when input-received middleware returns an output', () => {
        const middlewareOutput = new Output();
        const dispatch = vi.fn();
        const { handler } = build({
            router: { dispatch } as unknown as RouterContract,
            inputReceivedHandler: {
                inputReceived: (): OutputContract => middlewareOutput,
            } as InputReceivedHandlerContract,
        });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result).toBe(middlewareOutput);
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('builds an error output when dispatch throws an Error', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new Error('boom');
                },
            } as unknown as RouterContract,
        });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('builds an error output when dispatch throws a non-Error', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw 'oops';
                },
            } as unknown as RouterContract,
        });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('exit delegates to the processExiting handler', () => {
        const processExiting = vi.fn();
        const { handler } = build({
            processExitingHandler: { processExiting } as unknown as ProcessExitingHandlerContract,
        });

        handler.exit(new Input('cli', 'build'), new Output());

        expect(processExiting).toHaveBeenCalledTimes(1);
    });

    it('run handles, writes, exits, and signals the exit code', () => {
        const processExiting = vi.fn();
        const output = new Output();
        const writeSpy = vi.spyOn(output, 'writeMessages');
        const { handler } = build({
            router: { dispatch: () => output } as unknown as RouterContract,
            processExitingHandler: { processExiting } as unknown as ProcessExitingHandlerContract,
        });

        handler.run(new Input('cli', 'build'));

        expect(writeSpy).toHaveBeenCalledTimes(1);
        expect(processExiting).toHaveBeenCalledTimes(1);
        expect(stdoutSpy).toHaveBeenCalledWith(String(ExitCode.SUCCESS));
    });
});
