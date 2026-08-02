/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import { Option } from '../../../Interaction/Option/Option.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { InputReceivedMiddlewareContract } from '../../../Middleware/Contract/InputReceivedMiddlewareContract.ts';
import type { InputReceivedHandlerContract } from '../../../Middleware/Handler/Contract/InputReceivedHandlerContract.ts';

export class CheckForHelpOptionsMiddleware implements InputReceivedMiddlewareContract {
    constructor(
        protected commandName: string,
        protected optionName: string,
        protected optionShortName: string,
    ) {}

    inputReceived(input: InputContract, handler: InputReceivedHandlerContract): InputContract | OutputContract {
        if (input.hasOption(this.optionShortName) || input.hasOption(this.optionName)) {
            input = input.withCommandName(this.commandName).withOptions(new Option('command', input.getCommandName()));
        }

        return handler.inputReceived(input);
    }
}
