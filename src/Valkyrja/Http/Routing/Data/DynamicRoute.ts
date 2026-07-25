/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import { Route } from './Route.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { RequestStructContract } from '../../Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../Struct/Response/Contract/ResponseStructContract.ts';
import type { DynamicRouteContract } from './Contract/DynamicRouteContract.ts';
import type { ParameterContract } from './Contract/ParameterContract.ts';
import type { RouteContract } from './Contract/RouteContract.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class DynamicRoute extends Route implements DynamicRouteContract {
    constructor(
        path: string,
        name: string,
        protected regex: string,
        protected parameters: ParameterContract[],
        handler: (container: ContainerContract, route: RouteContract) => ResponseContract,
        requestMethods: RequestMethod[] = [RequestMethod.HEAD, RequestMethod.GET],
        routeMatchedMiddleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract> = [],
        routeDispatchedMiddleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract> = [],
        throwableCaughtMiddleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract> = [],
        sendingResponseMiddleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract> = [],
        responseSentMiddleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract> = [],
        requestStruct: RequestStructContract | null = null,
        responseStruct: ResponseStructContract | null = null,
    ) {
        super(
            path,
            name,
            handler,
            requestMethods,
            routeMatchedMiddleware,
            routeDispatchedMiddleware,
            throwableCaughtMiddleware,
            sendingResponseMiddleware,
            responseSentMiddleware,
            requestStruct,
            responseStruct,
        );
    }

    getRegex(): string {
        return this.regex;
    }

    withRegex(regex: string): this {
        const clone = ObjectFactory.clone(this);
        clone.regex = regex;
        return clone;
    }

    getParameters(): ParameterContract[] {
        return this.parameters;
    }

    withParameters(...parameters: ParameterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.parameters = parameters;
        return clone;
    }

    withAddedParameters(...parameters: ParameterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.parameters = [...this.parameters, ...parameters];
        return clone;
    }
}
