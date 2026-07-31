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
import type { ResponseSentHandlerContract } from '../Handler/Contract/ResponseSentHandlerContract.ts';

/** Middleware run after the response has been fully written to the wire. */
export interface ResponseSentMiddlewareContract {
    responseSent(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        handler: ResponseSentHandlerContract,
    ): Promise<void>;
}

export namespace ResponseSentMiddlewareContract {
    export function instanceOf(value: unknown): value is ResponseSentMiddlewareContract {
        return typeof value === 'object' && value !== null && 'responseSent' in value;
    }
}
