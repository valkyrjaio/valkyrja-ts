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
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.ts';

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
