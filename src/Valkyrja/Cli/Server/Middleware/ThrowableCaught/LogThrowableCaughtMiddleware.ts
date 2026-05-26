/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.js';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import type { LoggerContract } from '../../../../Log/Logger/Contract/LoggerContract.js';

export class LogThrowableCaughtMiddleware implements ThrowableCaughtMiddlewareContract {
    constructor(protected logger: LoggerContract) {}

    throwableCaught(
        input: InputContract,
        output: OutputContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): OutputContract {
        const commandName = input.getCommandName();
        const logMessage = `Cli Server Error\nUrl: ${commandName}`;

        this.logger.throwable(throwable instanceof Error ? throwable : new Error(String(throwable)), logMessage);

        return handler.throwableCaught(input, output, throwable);
    }
}
