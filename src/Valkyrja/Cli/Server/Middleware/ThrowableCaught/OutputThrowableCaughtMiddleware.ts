/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ExitCode } from '../../../Interaction/Enum/ExitCode.ts';
import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import { Banner } from '../../../Interaction/Message/Banner.ts';
import { ErrorMessage } from '../../../Interaction/Message/ErrorMessage.ts';
import { Message } from '../../../Interaction/Message/Message.ts';
import { NewLine } from '../../../Interaction/Message/NewLine.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';

export class OutputThrowableCaughtMiddleware implements ThrowableCaughtMiddlewareContract {
    throwableCaught(
        input: InputContract,
        output: OutputContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): OutputContract {
        const commandName = input.getCommandName();
        const err = throwable instanceof Error ? throwable : null;
        const message = err?.message ?? String(throwable);
        const line = err?.stack?.split('\n')[1]?.trim() ?? '';
        const trace = err?.stack ?? '';

        output = output
            .withExitCode(ExitCode.ERROR)
            .withMessages(
                new Banner(new ErrorMessage('Cli Server Error:')),
                new NewLine(),
                new ErrorMessage('Command:'),
                new Message(` ${commandName}`),
                new NewLine(),
                new NewLine(),
                new ErrorMessage('Message:'),
                new Message(` ${message}`),
                new NewLine(),
                new NewLine(),
                new ErrorMessage('Line:'),
                new Message(` ${line}`),
                new NewLine(),
                new NewLine(),
                new ErrorMessage('Trace:'),
                new NewLine(),
                new Message(`${trace}\n`),
            );

        return handler.throwableCaught(input, output, throwable);
    }
}
