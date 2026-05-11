import { allRequestMethods, RequestMethod } from '../../Message/Enum/RequestMethod.js';
import { DynamicRoute } from '../Data/DynamicRoute.js';
import { HttpRoutingData } from '../Data/HttpRoutingData.js';
import { HttpRoutingInvalidDynamicRouteNameException } from '../Throwable/Exception/HttpRoutingInvalidDynamicRouteNameException.js';
import { HttpRoutingInvalidRouteNameException } from '../Throwable/Exception/HttpRoutingInvalidRouteNameException.js';
import { HttpRoutingInvalidRoutePathException } from '../Throwable/Exception/HttpRoutingInvalidRoutePathException.js';
import { HttpRoutingInvalidRouteRegexException } from '../Throwable/Exception/HttpRoutingInvalidRouteRegexException.js';

import type { DynamicRouteContract } from '../Data/Contract/DynamicRouteContract.js';
import type { RouteContract } from '../Data/Contract/RouteContract.js';
import type { RouteCollectionContract } from './Contract/RouteCollectionContract.js';

export class RouteCollection implements RouteCollectionContract {
    protected routes: Record<string, () => RouteContract | DynamicRouteContract> = {};
    protected paths: Record<string, Record<string, string>>       = {};
    protected dynamicPaths: Record<string, Record<string, string>> = {};
    protected regexes: Record<string, Record<string, string>>     = {};

    getData(): HttpRoutingData {
        return new HttpRoutingData(this.routes, this.paths, this.dynamicPaths, this.regexes);
    }

    setFromData(data: HttpRoutingData): void {
        this.routes       = data.routes as Record<string, () => RouteContract | DynamicRouteContract>;
        this.paths        = data.paths as Record<string, Record<string, string>>;
        this.dynamicPaths = data.dynamicPaths as Record<string, Record<string, string>>;
        this.regexes      = data.regexes as Record<string, Record<string, string>>;
    }

    add(route: RouteContract): void {
        this.setRouteToRequestMethods(route);

        const name = route.getName();

        this.routes[name] = (): RouteContract => route;
    }

    hasPath(path: string, method: RequestMethod): boolean {
        if (method !== RequestMethod.ANY) {
            return (this.paths[method]?.[path] !== undefined)
                || (this.dynamicPaths[method]?.[path] !== undefined);
        }

        return allRequestMethods().some((m) => this.hasPath(path, m));
    }

    getByPath(path: string, method: RequestMethod): RouteContract {
        const route = this.internalGetByPath(path, method);

        if (route !== null) {
            return route;
        }

        throw new HttpRoutingInvalidRoutePathException(`The path '${path}' is not a valid route for the given method '${method}'`);
    }

    hasRegex(regex: string, method: RequestMethod): boolean {
        if (method !== RequestMethod.ANY) {
            return this.regexes[method]?.[regex] !== undefined;
        }

        return allRequestMethods().some((m) => this.hasRegex(regex, m));
    }

    getByRegex(regex: string, method: RequestMethod): DynamicRouteContract {
        const route = this.internalGetByRegex(regex, method);

        if (route !== null) {
            return route;
        }

        throw new HttpRoutingInvalidRouteRegexException(`The regex '${regex}' is not a valid route for the given method '${method}'`);
    }

    getPaths(method: RequestMethod): Record<string, string> {
        if (method !== RequestMethod.ANY) {
            return this.paths[method] ?? {};
        }

        return Object.assign(
            {},
            ...allRequestMethods().map((m) => this.paths[m] ?? {}),
            ...allRequestMethods().map((m) => this.dynamicPaths[m] ?? {}),
        ) as Record<string, string>;
    }

    getRegexes(method: RequestMethod): Record<string, string> {
        if (method !== RequestMethod.ANY) {
            return this.regexes[method] ?? {};
        }

        return Object.assign(
            {},
            ...allRequestMethods().map((m) => this.regexes[m] ?? {}),
        ) as Record<string, string>;
    }

    hasName(name: string): boolean {
        return this.routes[name] !== undefined;
    }

    getByName(name: string): RouteContract {
        const route = this.routes[name];

        if (route !== undefined) {
            return route();
        }

        throw new HttpRoutingInvalidRouteNameException(`A route with the name '${name}' does not exist`);
    }

    getAll(method: RequestMethod): Record<string, RouteContract> {
        const paths = this.getPaths(method);

        return Object.fromEntries(
            Object.entries(paths).map(([, name]) => [name, this.getRouteFromName(name)])
        );
    }

    protected internalGetByPath(path: string, method: RequestMethod): RouteContract | null {
        if (method !== RequestMethod.ANY) {
            const name = this.paths[method]?.[path] ?? this.dynamicPaths[method]?.[path];

            if (name !== undefined) {
                return this.getRouteFromName(name);
            }

            return null;
        }

        for (const m of allRequestMethods()) {
            const route = this.internalGetByPath(path, m);

            if (route !== null) {
                return route;
            }
        }

        return null;
    }

    protected internalGetByRegex(regex: string, method: RequestMethod): DynamicRouteContract | null {
        if (method !== RequestMethod.ANY) {
            const name = this.regexes[method]?.[regex];

            if (name !== undefined) {
                return this.getDynamicRouteFromName(name);
            }

            return null;
        }

        for (const m of allRequestMethods()) {
            const route = this.internalGetByRegex(regex, m);

            if (route !== null) {
                return route;
            }
        }

        return null;
    }

    protected setRouteToRequestMethods(route: RouteContract): void {
        let requestMethods = route.getRequestMethods();

        if (requestMethods.includes(RequestMethod.ANY)) {
            requestMethods = allRequestMethods();
        }

        for (const method of requestMethods) {
            this.setRouteToRequestMethod(route, method);
        }
    }

    protected setRouteToRequestMethod(route: RouteContract, method: RequestMethod): void {
        if (method === RequestMethod.ANY) {
            return;
        }

        const name = route.getName();
        const path = route.getPath();

        if (route instanceof DynamicRoute) {
            const regex = route.getRegex();

            this.dynamicPaths[method] ??= {};
            this.regexes[method]      ??= {};

            this.dynamicPaths[method][path]  = name;
            this.regexes[method][regex]      = name;

            return;
        }

        this.paths[method] ??= {};

        this.paths[method][path] = name;
    }

    protected getRouteFromName(name: string): RouteContract {
        const route = this.routes[name];

        if (route === undefined) {
            throw new HttpRoutingInvalidRouteNameException(`Invalid name '${name}' provided`);
        }

        return route();
    }

    protected getDynamicRouteFromName(name: string): DynamicRouteContract {
        const route = this.getRouteFromName(name);

        if (route instanceof DynamicRoute) {
            return route;
        }

        throw new HttpRoutingInvalidDynamicRouteNameException(`Invalid dynamic route ${name}`);
    }
}