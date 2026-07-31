/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcRoutingInvalidMethodException } from '../Throwable/Exception/GrpcRoutingInvalidMethodException.ts';

import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouteCollectionContract } from './Contract/RouteCollectionContract.ts';

/**
 * The service map keyed by fully-qualified method name. A direct map lookup resolves an inbound call
 * to its {@link RouteContract} — no pattern matching, the same shape CLI uses for commands.
 */
export class RouteCollection implements RouteCollectionContract {
    protected readonly routes = new Map<string, RouteContract>();

    add(...routes: RouteContract[]): this {
        for (const route of routes) {
            this.routes.set(route.getMethod(), route);
        }

        return this;
    }

    get(method: string): RouteContract {
        const route = this.routes.get(method);

        if (route !== undefined) {
            return route;
        }

        throw new GrpcRoutingInvalidMethodException(`The route \`${method}\` was not found.`);
    }

    has(method: string): boolean {
        return this.routes.has(method);
    }

    all(): Map<string, RouteContract> {
        return new Map(this.routes);
    }
}
