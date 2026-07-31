/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

/**
 * Supplies pre-built routes for the service map, mirroring HTTP's `HttpRouteProviderContract` and
 * CLI's `CliRouteProviderContract`.
 */
export interface GrpcRouteProviderContract {
    getRoutes(): RouteContract[];
}

export namespace GrpcRouteProviderContract {
    export function instanceOf(value: unknown): value is GrpcRouteProviderContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
