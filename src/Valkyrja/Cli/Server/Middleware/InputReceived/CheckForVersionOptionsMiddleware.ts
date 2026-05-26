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
import type { InputReceivedMiddlewareContract } from '../../../Middleware/Contract/InputReceivedMiddlewareContract.js';
import type { InputReceivedHandlerContract } from '../../../Middleware/Handler/Contract/InputReceivedHandlerContract.js';

export class CheckForVersionOptionsMiddleware implements InputReceivedMiddlewareContract {
    constructor(
        protected commandName: string,
        protected optionName: string,
        protected optionShortName: string,
    ) {}

    inputReceived(input: InputContract, handler: InputReceivedHandlerContract): InputContract | OutputContract {
        if (input.hasOption(this.optionShortName) || input.hasOption(this.optionName)) {
            input = input.withCommandName(this.commandName).withOptions();
        }

        return handler.inputReceived(input);
    }
}
