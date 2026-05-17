import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import { Option } from '../../../Interaction/Option/Option.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { InputReceivedMiddlewareContract } from '../../../Middleware/Contract/InputReceivedMiddlewareContract.js';
import type { InputReceivedHandlerContract } from '../../../Middleware/Handler/Contract/InputReceivedHandlerContract.js';

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
