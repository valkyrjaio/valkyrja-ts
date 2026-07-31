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
import type { ResponseSentMiddlewareContract } from '../Contract/ResponseSentMiddlewareContract.ts';
import type { ResponseSentHandlerContract } from './Contract/ResponseSentHandlerContract.ts';

/**
 * Walks the `ResponseSent` chain after the response has been written to the wire. This stage always
 * runs — including on the cancellation fast-exit path — so it does not apply the cancellation
 * short-circuit.
 */
export class ResponseSentHandler
    extends Handler<ResponseSentMiddlewareContract>
    implements ResponseSentHandlerContract
{
    async responseSent(call: ServiceCallContract, response: ServiceResponseContract): Promise<void> {
        const next = this.next;

        if (next !== null) {
            await this.getMiddleware(next).responseSent(call, response, this);
        }
    }
}
