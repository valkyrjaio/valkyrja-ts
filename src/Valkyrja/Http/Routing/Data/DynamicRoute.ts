import { RequestMethod } from '../../../Message/Enum/RequestMethod.js';
import { Route } from './Route.js';

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../../Middleware/Contract/RouteDispatchedMiddlewareContract.js';
import type { RouteMatchedMiddlewareContract } from '../../../Middleware/Contract/RouteMatchedMiddlewareContract.js';
import type { SendingResponseMiddlewareContract } from '../../../Middleware/Contract/SendingResponseMiddlewareContract.js';
import type { TerminatedMiddlewareContract } from '../../../Middleware/Contract/TerminatedMiddlewareContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.js';
import type { RequestStructContract } from '../../../Struct/Request/Contract/RequestStructContract.js';
import type { ResponseStructContract } from '../../../Struct/Response/Contract/ResponseStructContract.js';
import type { DynamicRouteContract } from './Contract/DynamicRouteContract.js';
import type { ParameterContract } from './Contract/ParameterContract.js';
import type { RouteContract } from './Contract/RouteContract.js';

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
        terminatedMiddleware: Array<new (...args: unknown[]) => TerminatedMiddlewareContract> = [],
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
            terminatedMiddleware,
            requestStruct,
            responseStruct,
        );
    }

    getRegex(): string {
        return this.regex;
    }

    withRegex(regex: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.regex     = regex;
        return clone;
    }

    getParameters(): ParameterContract[] {
        return this.parameters;
    }

    withParameters(...parameters: ParameterContract[]): this {
        const clone          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.parameters     = parameters;
        return clone;
    }

    withAddedParameters(...parameters: ParameterContract[]): this {
        const clone          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.parameters     = [...this.parameters, ...parameters];
        return clone;
    }
}