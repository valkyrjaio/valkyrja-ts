/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRoutingData } from '../Data/GrpcRoutingData.ts';
import { GrpcRoutingInvalidMethodException } from '../Throwable/Exception/GrpcRoutingInvalidMethodException.ts';

import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouteCollectionContract } from './Contract/RouteCollectionContract.ts';

export class RouteCollection implements RouteCollectionContract {
    protected routes: Record<string, () => RouteContract> = {};

    getData(): GrpcRoutingData {
        return new GrpcRoutingData(this.routes);
    }

    setFromData(data: GrpcRoutingData): void {
        this.routes = data.routes;
    }

    add(...routes: RouteContract[]): this {
        for (const route of routes) {
            this.routes[route.getMethod()] = (): RouteContract => route;
        }

        return this;
    }

    get(method: string): RouteContract {
        const route = this.routes[method];

        if (route !== undefined) {
            return this.ensureRoute(route);
        }

        throw new GrpcRoutingInvalidMethodException(`The route \`${method}\` was not found.`);
    }

    has(method: string): boolean {
        return method in this.routes;
    }

    all(): Map<string, RouteContract> {
        const result = new Map<string, RouteContract>();

        for (const [method, route] of Object.entries(this.routes)) {
            result.set(method, this.ensureRoute(route));
        }

        return result;
    }

    protected ensureRoute(route: () => RouteContract): RouteContract {
        return route();
    }
}
