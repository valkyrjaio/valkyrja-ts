/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CliInteractionConfigContract } from '../../../Interaction/Data/Contract/CliInteractionConfigContract.ts';
import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { InputReceivedMiddlewareContract } from '../../../Middleware/Contract/InputReceivedMiddlewareContract.ts';
import type { InputReceivedHandlerContract } from '../../../Middleware/Handler/Contract/InputReceivedHandlerContract.ts';

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
