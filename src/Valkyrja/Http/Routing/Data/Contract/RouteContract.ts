/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RequestMethod } from '../../../Message/Enum/RequestMethod.ts';
import type { RouteMatchedMiddlewareContract } from '../../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RequestStructContract } from '../../../Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../../Struct/Response/Contract/ResponseStructContract.ts';

export interface RouteContract {
    getPath(): string;
    withPath(path: string): this;
    withAddedPath(path: string): this;
    getName(): string;
    withName(name: string): this;
    withAddedName(name: string): this;
    getHandler(): (container: ContainerContract, route: RouteContract) => ResponseContract;
    withHandler(handler: (container: ContainerContract, route: RouteContract) => ResponseContract): this;
    getRequestMethods(): RequestMethod[];
    hasRequestMethod(requestMethod: RequestMethod): boolean;
    withRequestMethods(...requestMethods: RequestMethod[]): this;
    withAddedRequestMethods(...requestMethods: RequestMethod[]): this;
    getRouteMatchedMiddleware(): Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>;
    withRouteMatchedMiddleware(...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>): this;
    withAddedRouteMatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>
    ): this;
    getRouteDispatchedMiddleware(): Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>;
    withRouteDispatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>
    ): this;
    withAddedRouteDispatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>
    ): this;
    getThrowableCaughtMiddleware(): Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>;
    withThrowableCaughtMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>
    ): this;
    withAddedThrowableCaughtMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>
    ): this;
    getSendingResponseMiddleware(): Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>;
    withSendingResponseMiddleware(
        ...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>
    ): this;
    withAddedSendingResponseMiddleware(
        ...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>
    ): this;
    getResponseSentMiddleware(): Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>;
    withResponseSentMiddleware(...middleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>): this;
    withAddedResponseSentMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>
    ): this;
    hasRequestStruct(): boolean;
    getRequestStruct(): RequestStructContract;
    withRequestStruct(requestStruct: RequestStructContract): this;
    hasResponseStruct(): boolean;
    getResponseStruct(): ResponseStructContract;
    withResponseStruct(responseStruct: ResponseStructContract): this;
}
