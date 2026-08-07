/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedResult } from '../Data/CallReceivedResult.ts';
import type { CallReceivedHandlerContract } from '../Handler/Contract/CallReceivedHandlerContract.ts';

export interface CallReceivedMiddlewareContract {
    callReceived(call: ServiceCallContract, handler: CallReceivedHandlerContract): Promise<CallReceivedResult>;
}

export namespace CallReceivedMiddlewareContract {
    export function instanceOf(value: unknown): value is CallReceivedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'callReceived' in value;
    }
}
