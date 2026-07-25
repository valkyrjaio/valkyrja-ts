/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
