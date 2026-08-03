/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcRoutingData } from '../../Data/GrpcRoutingData.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

/** The service map: fully-qualified method name to {@link RouteContract}. */
export interface RouteCollectionContract {
    getData(): GrpcRoutingData;

    setFromData(data: GrpcRoutingData): void;

    add(...routes: RouteContract[]): this;

    get(method: string): RouteContract;

    has(method: string): boolean;

    all(): Map<string, RouteContract>;
}
