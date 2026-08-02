/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CliRoutingData } from '../../Data/CliRoutingData.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface RouteCollectionContract {
    getData(): CliRoutingData;
    setFromData(data: CliRoutingData): void;
    add(...commands: RouteContract[]): this;
    get(name: string): RouteContract;
    has(name: string): boolean;
    all(): Record<string, RouteContract>;
}

export namespace RouteCollectionContract {
    export function instanceOf(value: unknown): value is RouteCollectionContract {
        return typeof value === 'object' && value !== null && 'getData' in value;
    }
}
