/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import { HttpRoutingNoRequestStructException } from '../Throwable/Exception/HttpRoutingNoRequestStructException.ts';
import { HttpRoutingNoResponseStructException } from '../Throwable/Exception/HttpRoutingNoResponseStructException.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { RequestStructContract } from '../../Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../Struct/Response/Contract/ResponseStructContract.ts';
import type { RouteContract } from './Contract/RouteContract.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Route implements RouteContract {
    protected handler: (container: ContainerContract, route: RouteContract) => ResponseContract;

    constructor(
        protected path: string,
        protected name: string,
        handler: (container: ContainerContract, route: RouteContract) => ResponseContract,
        protected requestMethods: RequestMethod[] = [RequestMethod.HEAD, RequestMethod.GET],
        protected routeMatchedMiddleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract> = [],
        protected routeDispatchedMiddleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract> = [],
        protected throwableCaughtMiddleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract> = [],
        protected sendingResponseMiddleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract> = [],
        protected responseSentMiddleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract> = [],
        protected requestStruct: RequestStructContract | null = null,
        protected responseStruct: ResponseStructContract | null = null,
    ) {
        this.handler = handler;
    }

    getPath(): string {
        return this.path;
    }

    withPath(path: string): this {
        const clone = ObjectFactory.clone(this);
        clone.path = this.getFilteredPath(path);
        return clone;
    }

    withAddedPath(path: string): this {
        const clone = ObjectFactory.clone(this);
        clone.path = this.getFilteredPath(this.getFilteredPath(this.path) + this.getFilteredPath(path));
        return clone;
    }

    getName(): string {
        return this.name;
    }

    withName(name: string): this {
        const clone = ObjectFactory.clone(this);
        clone.name = name;
        return clone;
    }

    withAddedName(name: string): this {
        const clone = ObjectFactory.clone(this);
        clone.name = this.name + name;
        return clone;
    }

    getHandler(): (container: ContainerContract, route: RouteContract) => ResponseContract {
        return this.handler;
    }

    withHandler(handler: (container: ContainerContract, route: RouteContract) => ResponseContract): this {
        const clone = ObjectFactory.clone(this);
        clone.handler = handler;
        return clone;
    }

    getRequestMethods(): RequestMethod[] {
        return this.requestMethods;
    }

    hasRequestMethod(requestMethod: RequestMethod): boolean {
        return this.requestMethods.includes(requestMethod);
    }

    withRequestMethods(...requestMethods: RequestMethod[]): this {
        const clone = ObjectFactory.clone(this);
        clone.requestMethods = requestMethods;
        return clone;
    }

    withAddedRequestMethods(...requestMethods: RequestMethod[]): this {
        const clone = ObjectFactory.clone(this);
        const existing = [...this.requestMethods];

        for (const method of requestMethods) {
            if (!existing.includes(method)) {
                existing.push(method);
            }
        }

        clone.requestMethods = existing;
        return clone;
    }

    getRouteMatchedMiddleware(): Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract> {
        return this.routeMatchedMiddleware;
    }

    withRouteMatchedMiddleware(...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>): this {
        const clone = ObjectFactory.clone(this);
        clone.routeMatchedMiddleware = middleware;
        return clone;
    }

    withAddedRouteMatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.routeMatchedMiddleware = [...this.routeMatchedMiddleware, ...middleware];
        return clone;
    }

    getRouteDispatchedMiddleware(): Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract> {
        return this.routeDispatchedMiddleware;
    }

    withRouteDispatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.routeDispatchedMiddleware = middleware;
        return clone;
    }

    withAddedRouteDispatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.routeDispatchedMiddleware = [...this.routeDispatchedMiddleware, ...middleware];
        return clone;
    }

    getThrowableCaughtMiddleware(): Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract> {
        return this.throwableCaughtMiddleware;
    }

    withThrowableCaughtMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.throwableCaughtMiddleware = middleware;
        return clone;
    }

    withAddedThrowableCaughtMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.throwableCaughtMiddleware = [...this.throwableCaughtMiddleware, ...middleware];
        return clone;
    }

    getSendingResponseMiddleware(): Array<new (...args: unknown[]) => SendingResponseMiddlewareContract> {
        return this.sendingResponseMiddleware;
    }

    withSendingResponseMiddleware(
        ...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.sendingResponseMiddleware = middleware;
        return clone;
    }

    withAddedSendingResponseMiddleware(
        ...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.sendingResponseMiddleware = [...this.sendingResponseMiddleware, ...middleware];
        return clone;
    }

    getResponseSentMiddleware(): Array<new (...args: unknown[]) => ResponseSentMiddlewareContract> {
        return this.responseSentMiddleware;
    }

    withResponseSentMiddleware(...middleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>): this {
        const clone = ObjectFactory.clone(this);
        clone.responseSentMiddleware = middleware;
        return clone;
    }

    withAddedResponseSentMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>
    ): this {
        const clone = ObjectFactory.clone(this);
        clone.responseSentMiddleware = [...this.responseSentMiddleware, ...middleware];
        return clone;
    }

    hasRequestStruct(): boolean {
        return this.requestStruct !== null;
    }

    getRequestStruct(): RequestStructContract {
        if (this.requestStruct === null) {
            throw new HttpRoutingNoRequestStructException('No request struct was set for this route');
        }

        return this.requestStruct;
    }

    withRequestStruct(requestStruct: RequestStructContract): this {
        const clone = ObjectFactory.clone(this);
        clone.requestStruct = requestStruct;
        return clone;
    }

    hasResponseStruct(): boolean {
        return this.responseStruct !== null;
    }

    getResponseStruct(): ResponseStructContract {
        if (this.responseStruct === null) {
            throw new HttpRoutingNoResponseStructException('No response struct was set for this route');
        }

        return this.responseStruct;
    }

    withResponseStruct(responseStruct: ResponseStructContract): this {
        const clone = ObjectFactory.clone(this);
        clone.responseStruct = responseStruct;
        return clone;
    }

    protected getFilteredPath(path: string): string {
        const trimmed = path.replace(/^\/+|\/+$/g, '');

        return trimmed === '' ? '/' : '/' + trimmed;
    }
}
