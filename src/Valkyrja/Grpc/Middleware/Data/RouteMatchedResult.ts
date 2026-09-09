/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';

export class RouteMatchedResult {
    readonly route: RouteContract;
    readonly response: ServiceResponseContract | null;

    constructor(route: RouteContract, response: ServiceResponseContract | null = null) {
        this.route = route;
        this.response = response;
    }
}
