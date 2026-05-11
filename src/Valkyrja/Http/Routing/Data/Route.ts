import { RequestMethod } from '../../Message/Enum/RequestMethod.js';
import { HttpRoutingNoRequestStructException } from '../Throwable/Exception/HttpRoutingNoRequestStructException.js';
import { HttpRoutingNoResponseStructException } from '../Throwable/Exception/HttpRoutingNoResponseStructException.js';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.js';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.js';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.js';
import type { TerminatedMiddlewareContract } from '../../Middleware/Contract/TerminatedMiddlewareContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.js';
import type { RequestStructContract } from '../../Struct/Request/Contract/RequestStructContract.js';
import type { ResponseStructContract } from '../../Struct/Response/Contract/ResponseStructContract.js';
import type { RouteContract } from './Contract/RouteContract.js';

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
        protected terminatedMiddleware: Array<new (...args: unknown[]) => TerminatedMiddlewareContract> = [],
        protected requestStruct: RequestStructContract | null = null,
        protected responseStruct: ResponseStructContract | null = null,
    ) {
        this.handler = handler;
    }

    getPath(): string {
        return this.path;
    }

    withPath(path: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.path      = this.getFilteredPath(path);
        return clone;
    }

    withAddedPath(path: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.path      = this.getFilteredPath(this.getFilteredPath(this.path) + this.getFilteredPath(path));
        return clone;
    }

    getName(): string {
        return this.name;
    }

    withName(name: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.name      = name;
        return clone;
    }

    withAddedName(name: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.name      = this.name + name;
        return clone;
    }

    getHandler(): (container: ContainerContract, route: RouteContract) => ResponseContract {
        return this.handler;
    }

    withHandler(handler: (container: ContainerContract, route: RouteContract) => ResponseContract): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.handler    = handler;
        return clone;
    }

    getRequestMethods(): RequestMethod[] {
        return this.requestMethods;
    }

    hasRequestMethod(requestMethod: RequestMethod): boolean {
        return this.requestMethods.includes(requestMethod);
    }

    withRequestMethods(...requestMethods: RequestMethod[]): this {
        const clone              = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.requestMethods     = requestMethods;
        return clone;
    }

    withAddedRequestMethods(...requestMethods: RequestMethod[]): this {
        const clone          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        const existing       = [...this.requestMethods];

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
        const clone                       = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.routeMatchedMiddleware      = middleware;
        return clone;
    }

    withAddedRouteMatchedMiddleware(...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>): this {
        const clone                       = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.routeMatchedMiddleware      = [...this.routeMatchedMiddleware, ...middleware];
        return clone;
    }

    getRouteDispatchedMiddleware(): Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract> {
        return this.routeDispatchedMiddleware;
    }

    withRouteDispatchedMiddleware(...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>): this {
        const clone                          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.routeDispatchedMiddleware      = middleware;
        return clone;
    }

    withAddedRouteDispatchedMiddleware(...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>): this {
        const clone                          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.routeDispatchedMiddleware      = [...this.routeDispatchedMiddleware, ...middleware];
        return clone;
    }

    getThrowableCaughtMiddleware(): Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract> {
        return this.throwableCaughtMiddleware;
    }

    withThrowableCaughtMiddleware(...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>): this {
        const clone                          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.throwableCaughtMiddleware      = middleware;
        return clone;
    }

    withAddedThrowableCaughtMiddleware(...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>): this {
        const clone                          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.throwableCaughtMiddleware      = [...this.throwableCaughtMiddleware, ...middleware];
        return clone;
    }

    getSendingResponseMiddleware(): Array<new (...args: unknown[]) => SendingResponseMiddlewareContract> {
        return this.sendingResponseMiddleware;
    }

    withSendingResponseMiddleware(...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>): this {
        const clone                          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.sendingResponseMiddleware      = middleware;
        return clone;
    }

    withAddedSendingResponseMiddleware(...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>): this {
        const clone                          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.sendingResponseMiddleware      = [...this.sendingResponseMiddleware, ...middleware];
        return clone;
    }

    getTerminatedMiddleware(): Array<new (...args: unknown[]) => TerminatedMiddlewareContract> {
        return this.terminatedMiddleware;
    }

    withTerminatedMiddleware(...middleware: Array<new (...args: unknown[]) => TerminatedMiddlewareContract>): this {
        const clone                    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.terminatedMiddleware     = middleware;
        return clone;
    }

    withAddedTerminatedMiddleware(...middleware: Array<new (...args: unknown[]) => TerminatedMiddlewareContract>): this {
        const clone                    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.terminatedMiddleware     = [...this.terminatedMiddleware, ...middleware];
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
        const clone             = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.requestStruct     = requestStruct;
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
        const clone              = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.responseStruct     = responseStruct;
        return clone;
    }

    protected getFilteredPath(path: string): string {
        const trimmed = path.replace(/^\/+|\/+$/g, '');

        return trimmed === '' ? '/' : '/' + trimmed;
    }
}
