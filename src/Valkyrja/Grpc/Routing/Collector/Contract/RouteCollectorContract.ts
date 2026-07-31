/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

/** Builds `Route`s from decorated gRPC service controller classes. */
export interface RouteCollectorContract {
    getRoutes(...classes: Array<new (...args: unknown[]) => unknown>): RouteContract[];
}

export namespace RouteCollectorContract {
    export function instanceOf(value: unknown): value is RouteCollectorContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
