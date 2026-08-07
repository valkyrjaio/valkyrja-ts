/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Handler } from './Abstract/Handler.ts';

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { RouteNotMatchedHandlerContract } from './Contract/RouteNotMatchedHandlerContract.ts';

export class RouteNotMatchedHandler
    extends Handler<RouteNotMatchedMiddlewareContract>
    implements RouteNotMatchedHandlerContract
{
    async routeNotMatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
    ): Promise<ServiceResponseContract> {
        const preCheck = this.checkCancellation(call, response);

        if (preCheck !== null) {
            return preCheck;
        }

        const next = this.next;

        if (next === null) {
            return response;
        }

        const returned = await this.getMiddleware(next).routeNotMatched(call, response, this);
        const postCheck = this.checkCancellation(call, returned);

        return postCheck !== null ? postCheck : returned;
    }
}
