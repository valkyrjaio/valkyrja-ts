/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { LoggerContract } from '../../../../Log/Logger/Contract/LoggerContract.ts';

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
