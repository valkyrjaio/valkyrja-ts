/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../../Container/Manager/Container.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { TypeContract } from '../../../Type/Contract/TypeContract.ts';
import { RouteCollection } from '../Collection/RouteCollection.ts';
import { HttpRoutingInvalidRoutePathException } from '../Throwable/Exception/HttpRoutingInvalidRoutePathException.ts';

import type { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import type { DynamicRouteContract } from '../Data/Contract/DynamicRouteContract.ts';
import type { ParameterContract } from '../Data/Contract/ParameterContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import type { MatcherContract } from './Contract/MatcherContract.ts';

export class Matcher implements MatcherContract {
    constructor(
        protected collection: RouteCollectionContract = new RouteCollection(),
        protected container: ContainerContract = new Container(),
    ) {}

    match(path: string, requestMethod: RequestMethod): RouteContract | null {
        const normalizedPath = '/' + path.replace(/^\/+|\/+$/g, '');
        const route = this.matchStatic(normalizedPath, requestMethod);

        return route ?? this.matchDynamic(normalizedPath, requestMethod);
    }

    matchStatic(path: string, requestMethod: RequestMethod): RouteContract | null {
        if (this.collection.hasPath(path, requestMethod)) {
            return Object.assign(
                Object.create(
                    Object.getPrototypeOf(this.collection.getByPath(path, requestMethod)) as object | null,
                ) as RouteContract,
                this.collection.getByPath(path, requestMethod),
            );
        }

        return null;
    }

    matchDynamic(path: string, requestMethod: RequestMethod): RouteContract | null {
        const regexes = this.collection.getRegexes(requestMethod);

        for (const [regex] of Object.entries(regexes)) {
            if (regex === '') {
                continue;
            }

            const re = new RegExp(regex);
            const matches = re.exec(path);

            if (matches !== null) {
                return this.processArguments(this.collection.getByRegex(regex, requestMethod), matches);
            }
        }

        return null;
    }

    protected processArguments(route: DynamicRouteContract, matches: RegExpExecArray): DynamicRouteContract {
        const parameters = route.getParameters();

        if (parameters.length === 0) {
            throw new HttpRoutingInvalidRoutePathException('Route parameters must not be empty');
        }

        const namedGroups = matches.groups ?? {};
        const parametersWithValues: ParameterContract[] = [];

        for (const parameter of parameters) {
            const name = parameter.getName();
            const match = namedGroups[name] ?? parameter.getDefault();

            if (match === null || match === undefined) {
                parametersWithValues.push(parameter);
                continue;
            }

            const value = this.checkAndCastMatchValue(parameter, match as string);

            parametersWithValues.push(parameter.withValue(value));
        }

        return route.withParameters(...parametersWithValues);
    }

    protected checkAndCastMatchValue(parameter: ParameterContract, match: string): unknown {
        if (parameter.hasCast()) {
            return this.castMatchValue(parameter, match);
        }

        return match;
    }

    protected castMatchValue(parameter: ParameterContract, match: string): unknown {
        const cast = parameter.getCast();
        const type = this.container.getService<TypeContract>(cast.type, [match]);

        return cast.convert ? type.asValue() : type;
    }
}
