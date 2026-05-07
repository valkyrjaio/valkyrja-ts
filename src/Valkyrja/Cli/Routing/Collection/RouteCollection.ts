import type { RouteCollectionContract } from './Contract/RouteCollectionContract.js';
import type { RouteContract } from '../Data/Contract/RouteContract.js';
import { CliRoutingData } from '../Data/CliRoutingData.js';
import { CliRoutingInvalidRouteNameException } from '../Throwable/Exception/CliRoutingInvalidRouteNameException.js';

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