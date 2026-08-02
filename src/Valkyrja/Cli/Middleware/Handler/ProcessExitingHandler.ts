/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { ProcessExitingMiddlewareContract } from '../Contract/ProcessExitingMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { ProcessExitingHandlerContract } from './Contract/ProcessExitingHandlerContract.ts';

export class ProcessExitingHandler extends Handler implements ProcessExitingHandlerContract {
    processExiting(input: InputContract, output: OutputContract): void {
        const next = this.next;

        if (next !== null) {
            this.getMiddleware<ProcessExitingMiddlewareContract>(next).processExiting(input, output, this);
        }
    }
}
