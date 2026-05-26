/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { ExitedMiddlewareContract } from '../Contract/ExitedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { ExitedHandlerContract } from './Contract/ExitedHandlerContract.js';

export class ExitedHandler extends Handler implements ExitedHandlerContract {
    exited(input: InputContract, output: OutputContract): void {
        const next = this.next;

        if (next !== null) {
            this.getMiddleware<ExitedMiddlewareContract>(next).exited(input, output, this);
        }
    }
}
