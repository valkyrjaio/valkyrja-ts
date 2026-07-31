/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';
import type { CallReceivedResult } from '../../../../../src/Valkyrja/Grpc/Middleware/Data/CallReceivedResult.ts';
import type { CallReceivedHandlerContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Handler/Contract/CallReceivedHandlerContract.ts';

/** Continues the chain unchanged, so the handler walks on to the next middleware. */
export class PassThroughCallReceivedMiddlewareFixture implements CallReceivedMiddlewareContract {
    async callReceived(call: ServiceCallContract, handler: CallReceivedHandlerContract): Promise<CallReceivedResult> {
        return handler.callReceived(call);
    }
}
