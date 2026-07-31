/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { SendingResponseMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/SendingResponseMiddlewareContract.ts';

/** Rewrites the response on its way to the wire. */
export class RespondingSendingResponseMiddlewareFixture implements SendingResponseMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.unavailable('sending'));

    sendingResponse(): Promise<ServiceResponseContract> {
        return Promise.resolve(RespondingSendingResponseMiddlewareFixture.response);
    }
}
