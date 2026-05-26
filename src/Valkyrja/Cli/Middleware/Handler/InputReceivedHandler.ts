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
import type { InputReceivedMiddlewareContract } from '../Contract/InputReceivedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { InputReceivedHandlerContract } from './Contract/InputReceivedHandlerContract.js';

export class InputReceivedHandler extends Handler implements InputReceivedHandlerContract {
    inputReceived(input: InputContract): InputContract | OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<InputReceivedMiddlewareContract>(next).inputReceived(input, this)
            : input;
    }
}
