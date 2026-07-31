/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedResult } from '../Data/CallReceivedResult.ts';
import type { CallReceivedHandlerContract } from '../Handler/Contract/CallReceivedHandlerContract.ts';

/** Middleware run once per call before routing. Always runs. */
export interface CallReceivedMiddlewareContract {
    callReceived(call: ServiceCallContract, handler: CallReceivedHandlerContract): Promise<CallReceivedResult>;
}

export namespace CallReceivedMiddlewareContract {
    export function instanceOf(value: unknown): value is CallReceivedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'callReceived' in value;
    }
}
