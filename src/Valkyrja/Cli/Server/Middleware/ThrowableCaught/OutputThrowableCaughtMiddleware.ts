import { ExitCode } from '../../../Interaction/Enum/ExitCode.js';
import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import { Banner } from '../../../Interaction/Message/Banner.js';
import { ErrorMessage } from '../../../Interaction/Message/ErrorMessage.js';
import { Message } from '../../../Interaction/Message/Message.js';
import { NewLine } from '../../../Interaction/Message/NewLine.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.js';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';

export class OutputThrowableCaughtMiddleware implements ThrowableCaughtMiddlewareContract {
    throwableCaught(input: InputContract, output: OutputContract, throwable: unknown, handler: ThrowableCaughtHandlerContract): OutputContract {
        const commandName = input.getCommandName();
        const err         = throwable instanceof Error ? throwable : null;
        const message     = err?.message ?? String(throwable);
        const line        = err?.stack?.split('\n')[1]?.trim() ?? '';
        const trace       = err?.stack ?? '';

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