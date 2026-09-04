/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { SyncInputHandler } from '../../../../../../src/Valkyrja/Cli/Server/Handler/SyncInputHandler.ts';
import { Exiter } from '../../../../../../src/Valkyrja/Cli/Server/Support/Exiter.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { InputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ProcessExitingHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

afterEach(() => {
    Exiter.unfreeze();
    exitSpy.mockClear();
});

describe('SyncInputHandler', () => {
    it('ends the process at once rather than setting the exit code', () => {
        const output = new Output().withExitCode(ExitCode.ERROR);
        const handler = new SyncInputHandler(
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

        expect(exitSpy).toHaveBeenCalledWith(ExitCode.ERROR);
    });
});
