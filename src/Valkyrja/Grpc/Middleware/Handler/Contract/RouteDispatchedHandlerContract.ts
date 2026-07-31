/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RouteDispatchedHandlerContract extends HandlerContract<RouteDispatchedMiddlewareContract> {
    routeDispatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        route: RouteContract,
    ): Promise<ServiceResponseContract>;
}
