/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

/** The service map: fully-qualified method name to {@link RouteContract}. */
export interface RouteCollectionContract {
    add(...routes: RouteContract[]): this;

    get(method: string): RouteContract;

    has(method: string): boolean;

    all(): Map<string, RouteContract>;
}
