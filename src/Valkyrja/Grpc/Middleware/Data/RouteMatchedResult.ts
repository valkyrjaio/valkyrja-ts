/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';

/**
 * The outcome of the `RouteMatched` stage: either the (possibly updated) route to dispatch to the
 * handler, or a response that short-circuits the pipeline.
 */
export class RouteMatchedResult {
    readonly route: RouteContract;
    readonly response: ServiceResponseContract | null;

    constructor(route: RouteContract, response: ServiceResponseContract | null = null) {
        this.route = route;
        this.response = response;
    }
}
