/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteCollectionContract } from './Contract/RouteCollectionContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import { CliRoutingData } from '../Data/CliRoutingData.ts';
import { CliRoutingInvalidRouteNameException } from '../Throwable/Exception/CliRoutingInvalidRouteNameException.ts';

export class RouteCollection implements RouteCollectionContract {
    protected routes: Record<string, () => RouteContract> = {};

    getData(): CliRoutingData {
        return new CliRoutingData(this.routes);
    }

    setFromData(data: CliRoutingData): void {
        this.routes = data.routes;
    }

    add(...commands: RouteContract[]): this {
        for (const command of commands) {
            this.routes[command.getName()] = () => command;
        }
        return this;
    }

    get(name: string): RouteContract {
        const route = this.routes[name];

        if (route !== undefined) {
            return this.ensureRoute(route);
        }

        throw new CliRoutingInvalidRouteNameException(`The route \`${name}\` was not found.`);
    }

    has(name: string): boolean {
        return name in this.routes;
    }

    all(): Record<string, RouteContract> {
        const result: Record<string, RouteContract> = {};

        for (const [name, route] of Object.entries(this.routes)) {
            result[name] = this.ensureRoute(route);
        }

        return result;
    }

    protected ensureRoute(route: () => RouteContract): RouteContract {
        return route();
    }
}
