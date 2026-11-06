/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface GrpcRouteProviderContract {
    /**
     * The service controller classes whose routing decorators Sindri (and, on
     * the debug path, the runtime `AttributeRouteCollector`) should scan.
     */
    getControllerClasses(): Array<new (...args: unknown[]) => unknown>;
    getRoutes(): RouteContract[];
}

export namespace GrpcRouteProviderContract {
    export function instanceOf(value: unknown): value is GrpcRouteProviderContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
