/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface RouteCollectorContract {
    getRoutes(...classes: Array<new (...args: unknown[]) => unknown>): RouteContract[];
}

export namespace RouteCollectorContract {
    export function instanceOf(value: unknown): value is RouteCollectorContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
