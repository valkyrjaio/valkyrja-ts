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
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.js';

export class ThrowableCaughtHandler extends Handler implements ThrowableCaughtHandlerContract {
    throwableCaught(input: InputContract, output: OutputContract, throwable: unknown): OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<ThrowableCaughtMiddlewareContract>(next).throwableCaught(
                  input,
                  output,
                  throwable,
                  this,
              )
            : output;
    }
}
