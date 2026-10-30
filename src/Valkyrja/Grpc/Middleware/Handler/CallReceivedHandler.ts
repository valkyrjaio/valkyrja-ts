/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CallReceivedResult } from '../Data/CallReceivedResult.ts';
import { Handler } from './Abstract/Handler.ts';

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedMiddlewareContract } from '../Contract/CallReceivedMiddlewareContract.ts';
import type { CallReceivedHandlerContract } from './Contract/CallReceivedHandlerContract.ts';

export class CallReceivedHandler
    extends Handler<CallReceivedMiddlewareContract>
    implements CallReceivedHandlerContract
{
    async callReceived(call: ServiceCallContract): Promise<CallReceivedResult> {
        const preCheck = this.checkCancellation(call);

        if (preCheck !== null) {
            return new CallReceivedResult(call, preCheck);
        }

        const next = this.next;

        if (next === null) {
            return new CallReceivedResult(call);
        }

        const result = await this.getMiddleware(next).callReceived(call, this);
        const postCheck = this.checkCancellation(call, result.response);

        if (postCheck !== null) {
            return new CallReceivedResult(result.call, postCheck);
        }

        return result;
    }
}
