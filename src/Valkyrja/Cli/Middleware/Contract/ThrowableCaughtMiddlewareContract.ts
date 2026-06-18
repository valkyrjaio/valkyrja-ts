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
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';

export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        input: InputContract,
        output: OutputContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): OutputContract;
}

export namespace ThrowableCaughtMiddlewareContract {
    export function instanceOf(value: unknown): value is ThrowableCaughtMiddlewareContract {
        return typeof value === 'object' && value !== null && 'throwableCaught' in value;
    }
}
