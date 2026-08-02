/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedMiddlewareContract } from '../../Contract/CallReceivedMiddlewareContract.ts';
import type { CallReceivedResult } from '../../Data/CallReceivedResult.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface CallReceivedHandlerContract extends HandlerContract<CallReceivedMiddlewareContract> {
    callReceived(call: ServiceCallContract): Promise<CallReceivedResult>;
}
