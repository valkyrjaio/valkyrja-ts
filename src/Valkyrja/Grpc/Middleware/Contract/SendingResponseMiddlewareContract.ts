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
import type { SendingResponseHandlerContract } from '../Handler/Contract/SendingResponseHandlerContract.ts';

/** Middleware run before the adapter writes the response to the wire. Always runs. */
export interface SendingResponseMiddlewareContract {
    sendingResponse(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        handler: SendingResponseHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace SendingResponseMiddlewareContract {
    export function instanceOf(value: unknown): value is SendingResponseMiddlewareContract {
        return typeof value === 'object' && value !== null && 'sendingResponse' in value;
    }
}
