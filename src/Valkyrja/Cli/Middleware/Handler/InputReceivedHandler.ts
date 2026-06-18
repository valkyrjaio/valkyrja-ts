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
import type { InputReceivedMiddlewareContract } from '../Contract/InputReceivedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { InputReceivedHandlerContract } from './Contract/InputReceivedHandlerContract.ts';

export class InputReceivedHandler extends Handler implements InputReceivedHandlerContract {
    inputReceived(input: InputContract): InputContract | OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<InputReceivedMiddlewareContract>(next).inputReceived(input, this)
            : input;
    }
}
