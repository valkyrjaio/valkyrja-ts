/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Handler } from './Abstract/Handler.ts';

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.ts';

/**
 * Walks the `ThrowableCaught` chain with the two-question cancellation check bracketing each step.
 */
export class ThrowableCaughtHandler
    extends Handler<ThrowableCaughtMiddlewareContract>
    implements ThrowableCaughtHandlerContract
{
    async throwableCaught(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        throwable: unknown,
    ): Promise<ServiceResponseContract> {
        const preCheck = this.checkCancellation(call, response);

        if (preCheck !== null) {
            return preCheck;
        }

        const next = this.next;

        if (next === null) {
            return response;
        }

        const returned = await this.getMiddleware(next).throwableCaught(call, response, throwable, this);
        const postCheck = this.checkCancellation(call, returned);

        return postCheck !== null ? postCheck : returned;
    }
}
