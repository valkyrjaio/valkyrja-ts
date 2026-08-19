/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { RouteCollection } from '../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';

import type { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import type { RouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';

/**
 * Exposes RouteCollection's protected members so the request-method guard can be driven directly.
 */
export class CollectionFixture extends RouteCollection {
    public setRouteToRequestMethodWrapper(route: RouteContract, method: RequestMethod): void {
        this.setRouteToRequestMethod(route, method);
    }
}
