/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';
import { GrpcRoutingInvalidMethodException } from '../Throwable/Exception/GrpcRoutingInvalidMethodException.ts';

import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { MessageType, RouteContract, RouteHandler } from './Contract/RouteContract.ts';

export class Route implements RouteContract {
    protected handler: RouteHandler;

    constructor(
        protected method: string,
        handler: RouteHandler,
        protected service: string = Route.serviceOf(method),
        protected methodName: string = Route.methodNameOf(method),
        protected requestType: MessageType | null = null,
        protected responseType: MessageType | null = null,
        protected clientStreaming: boolean = false,
        protected serverStreaming: boolean = false,
        protected routeMatchedMiddleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract> = [],
        protected routeDispatchedMiddleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract> = [],
        protected throwableCaughtMiddleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract> = [],
        protected sendingResponseMiddleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract> = [],
        protected responseSentMiddleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract> = [],
    ) {
        this.handler = handler;
    }

    getMethod(): string {
        return this.method;
    }

    getService(): string {
        return this.service;
    }

    getMethodName(): string {
        return this.methodName;
    }

    getHandler(): RouteHandler {
        return this.handler;
    }

    withHandler(handler: RouteHandler): this {
        const clone = ObjectFactory.clone(this);

        clone.handler = handler;

        return clone;
    }

    getRequestType(): MessageType | null {
        return this.requestType;
    }

    withRequestType(requestType: MessageType | null): this {
        const clone = ObjectFactory.clone(this);

        clone.requestType = requestType;

        return clone;
    }

    getResponseType(): MessageType | null {
        return this.responseType;
    }

    withResponseType(responseType: MessageType | null): this {
        const clone = ObjectFactory.clone(this);

        clone.responseType = responseType;

        return clone;
    }

    isClientStreaming(): boolean {
        return this.clientStreaming;
    }

    withClientStreaming(clientStreaming: boolean): this {
        const clone = ObjectFactory.clone(this);

        clone.clientStreaming = clientStreaming;

        return clone;
    }

    isServerStreaming(): boolean {
        return this.serverStreaming;
    }

    withServerStreaming(serverStreaming: boolean): this {
        const clone = ObjectFactory.clone(this);

        clone.serverStreaming = serverStreaming;

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

    /** Extract the `package.Service` portion of a `/package.Service/Method` method. */
    protected static serviceOf(method: string): string {
        const firstSlash = method.indexOf('/');
        const lastSlash = method.lastIndexOf('/');

        if (firstSlash !== 0 || lastSlash <= firstSlash) {
            throw new GrpcRoutingInvalidMethodException(
                `Invalid gRPC method \`${method}\`; expected \`/package.Service/Method\``,
            );
        }

        return method.substring(firstSlash + 1, lastSlash);
    }

    /** Extract the `Method` portion of a `/package.Service/Method` method. */
    protected static methodNameOf(method: string): string {
        const lastSlash = method.lastIndexOf('/');

        if (lastSlash === method.length - 1) {
            throw new GrpcRoutingInvalidMethodException(
                `Invalid gRPC method \`${method}\`; expected \`/package.Service/Method\``,
            );
        }

        return method.substring(lastSlash + 1);
    }
}
