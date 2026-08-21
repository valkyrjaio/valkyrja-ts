/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
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

const passInput = {
    inputReceived: (input: InputContract): InputContract => input,
} as unknown as InputReceivedHandlerContract;
const passThrowable = {
    throwableCaught: (_input: InputContract, output: OutputContract): OutputContract => output,
} as unknown as ThrowableCaughtHandlerContract;

function build(overrides: {
    router?: RouterContract;
    inputReceivedHandler?: InputReceivedHandlerContract;
    processExitingHandler?: ProcessExitingHandlerContract;
    throwableCaughtHandler?: ThrowableCaughtHandlerContract;
}): { handler: InputHandler; container: Container } {
    const container = new Container();
    const handler = new InputHandler(
        container,
        overrides.router ?? ({ dispatch: () => new Output() } as unknown as RouterContract),
        overrides.inputReceivedHandler ?? passInput,
        overrides.throwableCaughtHandler ?? passThrowable,
        overrides.processExitingHandler ?? ({ processExiting: vi.fn() } as unknown as ProcessExitingHandlerContract),
        new CliInteractionConfig(),
        new OutputFactory(),
    );

    return { handler, container };
}

// The suite itself ends with process.exitCode, so each test restores the code it found.
let originalExitCode: typeof process.exitCode;

beforeEach(() => {
    originalExitCode = process.exitCode;
    Exiter.freeze();
});
afterEach(() => {
    process.exitCode = originalExitCode;
    Exiter.unfreeze();
    stdoutSpy.mockClear();
});

describe('InputHandler', () => {
    it('registers the written output on the success path', () => {
        const output = new Output().withIsSilent(true).withAddedMessage(new Message('hi'));
        const { handler, container } = build({ router: { dispatch: () => output } as unknown as RouterContract });

        handler.run(new Input('cli', 'build'));

        const registered = container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract);

        expect(registered).not.toBe(output);
        expect(registered.hasWrittenMessage()).toBe(true);
        expect(registered.hasUnwrittenMessage()).toBe(false);
    });

    it('sets the process exit code and does not end the process', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const { handler } = build({
            router: { dispatch: () => new Output().withExitCode(ExitCode.SUCCESS) } as unknown as RouterContract,
        });

        handler.run(new Input('cli', 'build'));

        expect(process.exitCode).toBe(ExitCode.SUCCESS);
        expect(exitSpy).not.toHaveBeenCalled();

        exitSpy.mockRestore();
    });

    it('falls back to a printing output when the recovery write also fails', () => {
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        const { handler } = build({
            router: {
                dispatch: () => new FileOutput(unwritable).withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
            // The middleware routes the recovery output back to the destination that failed.
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract =>
                    new FileOutput(unwritable).withAddedMessage(new Message('recovery')),
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
    });

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
            } as unknown as InputReceivedHandlerContract,
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
                    // Throwing a non-Error is the whole point of this case: it proves the
                    // handler wraps it.
                    // eslint-disable-next-line @typescript-eslint/only-throw-error
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

    it('run routes a write throwable through the throwable caught handler', () => {
        const processExiting = vi.fn();
        const unwritable = new FileOutput('/nonexistent-valkyrja-dir/out.log').withAddedMessage(new Message('hello'));
        const { handler } = build({
            router: { dispatch: () => unwritable } as unknown as RouterContract,
            processExitingHandler: { processExiting } as unknown as ProcessExitingHandlerContract,
        });

        handler.run(new Input('cli', 'build'));

        expect(processExiting).toHaveBeenCalledTimes(1);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
        expect(stdoutSpy).toHaveBeenCalledWith(String(ExitCode.ERROR));
    });
});
