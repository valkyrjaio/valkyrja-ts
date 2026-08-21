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
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { InputHandler } from '../../../../../../src/Valkyrja/Cli/Server/Handler/InputHandler.ts';
import { Exiter } from '../../../../../../src/Valkyrja/Cli/Server/Support/Exiter.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { InputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ProcessExitingHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

// The suite itself ends with process.exitCode, so each test restores the code it found.
let originalExitCode: typeof process.exitCode;

beforeEach(() => {
    originalExitCode = process.exitCode;
});

afterEach(() => {
    process.exitCode = originalExitCode;
    Exiter.unfreeze();
    exitSpy.mockClear();
});

describe('InputHandler exit code', () => {
    it('sets the process exit code and does not end the process', () => {
        const output = new Output().withExitCode(ExitCode.SUCCESS);
        const handler = new InputHandler(
            new Container(),
            { dispatch: () => output } as unknown as RouterContract,
            {
                inputReceived: (input: InputContract): InputContract => input,
            } as unknown as InputReceivedHandlerContract,
            {
                throwableCaught: (_input: InputContract, out: OutputContract): OutputContract => out,
            } as unknown as ThrowableCaughtHandlerContract,
            { processExiting: (): void => undefined } as unknown as ProcessExitingHandlerContract,
            new CliInteractionConfig(),
            new OutputFactory(),
        );

        handler.run(new Input('cli', 'build'));

        expect(process.exitCode).toBe(ExitCode.SUCCESS);
        expect(exitSpy).not.toHaveBeenCalled();
    });

    it('falls back to an echoing output when the recovery write also fails', () => {
        const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        const output = new FileOutput(unwritable).withAddedMessage(new Message('hello'));
        const handler = new InputHandler(
            new Container(),
            { dispatch: () => output } as unknown as RouterContract,
            {
                inputReceived: (input: InputContract): InputContract => input,
            } as unknown as InputReceivedHandlerContract,
            {
                // The middleware routes the recovery output back to the destination that failed.
                throwableCaught: (): OutputContract =>
                    new FileOutput(unwritable).withAddedMessage(new Message('recovery')),
            } as unknown as ThrowableCaughtHandlerContract,
            { processExiting: (): void => undefined } as unknown as ProcessExitingHandlerContract,
            new CliInteractionConfig(),
            new OutputFactory(),
        );

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));

        stdoutSpy.mockRestore();
    });
});
