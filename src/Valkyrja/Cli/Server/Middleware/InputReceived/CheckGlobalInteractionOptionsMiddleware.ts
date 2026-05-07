import type { CliInteractionConfigContract } from '../../../Interaction/Data/Contract/CliInteractionConfigContract.js';
import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { InputReceivedMiddlewareContract } from '../../../Middleware/Contract/InputReceivedMiddlewareContract.js';
import type { InputReceivedHandlerContract } from '../../../Middleware/Handler/Contract/InputReceivedHandlerContract.js';

export class CheckGlobalInteractionOptionsMiddleware implements InputReceivedMiddlewareContract {
    constructor(
        protected config: CliInteractionConfigContract,
        protected noInteractionOptionName: string,
        protected noInteractionOptionShortName: string,
        protected quietOptionName: string,
        protected quietOptionShortName: string,
        protected silentOptionName: string,
        protected silentOptionShortName: string,
    ) {}

    inputReceived(input: InputContract, handler: InputReceivedHandlerContract): InputContract | OutputContract {
        this.setIsInteractive(input);
        this.setIsQuiet(input);
        this.setIsSilent(input);

        return handler.inputReceived(input);
    }

    protected setIsInteractive(input: InputContract): void {
        if (input.hasOption(this.noInteractionOptionShortName) || input.hasOption(this.noInteractionOptionName)) {
            this.config.isInteractive = false;
        }
    }

    protected setIsQuiet(input: InputContract): void {
        if (input.hasOption(this.quietOptionShortName) || input.hasOption(this.quietOptionName)) {
            this.config.isQuiet = true;
        }
    }

    protected setIsSilent(input: InputContract): void {
        if (input.hasOption(this.silentOptionShortName) || input.hasOption(this.silentOptionName)) {
            this.config.isSilent = true;
        }
    }
}