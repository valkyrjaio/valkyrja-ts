/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Contract/ResponseSentMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface ResponseSentHandlerContract extends HandlerContract<ResponseSentMiddlewareContract> {
    responseSent(call: ServiceCallContract, response: ServiceResponseContract): Promise<void>;
}
