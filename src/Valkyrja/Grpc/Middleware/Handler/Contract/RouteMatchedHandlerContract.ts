/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteMatchedResult } from '../../Data/RouteMatchedResult.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RouteMatchedHandlerContract extends HandlerContract<RouteMatchedMiddlewareContract> {
    routeMatched(call: ServiceCallContract, route: RouteContract): Promise<RouteMatchedResult>;
}
