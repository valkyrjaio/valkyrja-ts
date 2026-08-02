/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RequestMethod } from '../../../Message/Enum/RequestMethod.ts';
import type { DynamicRouteContract } from '../../Data/Contract/DynamicRouteContract.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';
import type { HttpRoutingData } from '../../Data/HttpRoutingData.ts';

export interface RouteCollectionContract {
    getData(): HttpRoutingData;
    setFromData(data: HttpRoutingData): void;
    add(route: RouteContract): void;
    hasPath(path: string, method: RequestMethod): boolean;
    getByPath(path: string, method: RequestMethod): RouteContract;
    hasRegex(regex: string, method: RequestMethod): boolean;
    getByRegex(regex: string, method: RequestMethod): DynamicRouteContract;
    getPaths(method: RequestMethod): Record<string, string>;
    getRegexes(method: RequestMethod): Record<string, string>;
    hasName(name: string): boolean;
    getByName(name: string): RouteContract;
    getAll(method: RequestMethod): Record<string, RouteContract>;
}
