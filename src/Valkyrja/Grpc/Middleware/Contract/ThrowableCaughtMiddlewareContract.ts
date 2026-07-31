/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';

/** Middleware run when an earlier stage throws, converting the throwable into a response. */
export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace ThrowableCaughtMiddlewareContract {
    export function instanceOf(value: unknown): value is ThrowableCaughtMiddlewareContract {
        return typeof value === 'object' && value !== null && 'throwableCaught' in value;
    }
}
