/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RequestMethod } from '../../../Message/Enum/RequestMethod.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface MatcherContract {
    match(path: string, requestMethod: RequestMethod): RouteContract | null;
    matchStatic(path: string, requestMethod: RequestMethod): RouteContract | null;
    matchDynamic(path: string, requestMethod: RequestMethod): RouteContract | null;
}
