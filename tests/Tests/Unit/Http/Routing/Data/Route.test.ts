/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { HttpRoutingNoRequestStructException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingNoRequestStructException.ts';
import { HttpRoutingNoResponseStructException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingNoResponseStructException.ts';

import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { RequestStructContract } from '../../../../../../src/Valkyrja/Http/Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../../../../../src/Valkyrja/Http/Struct/Response/Contract/ResponseStructContract.ts';

const handler = (): ResponseContract => ({}) as unknown as ResponseContract;

// The route only stores and hands back the middleware class reference — it never instantiates it —
// so one stand-in serves every middleware group. Declaring the construct signature as returning
// `never` makes it assignable to all five contracts without five separate stubs.
const Middleware = class {} as unknown as new (...args: unknown[]) => never;

describe('Route', () => {
    it('exposes its path, name, and handler immutably', () => {
        const route = new Route('/users', 'users.index', handler);

        expect(route.getPath()).toBe('/users');
        expect(route.getName()).toBe('users.index');
        expect(route.getHandler()).toBe(handler);

        expect(route.withPath('posts/').getPath()).toBe('/posts');
        expect(route.withAddedPath('comments').getPath()).toBe('/users/comments');
        expect(route.withName('users.list').getName()).toBe('users.list');
        expect(route.withAddedName('.json').getName()).toBe('users.index.json');

        const other = (): ResponseContract => ({}) as unknown as ResponseContract;
        expect(route.withHandler(other).getHandler()).toBe(other);
    });

    it('normalizes an empty path to root', () => {
        expect(new Route('/users', 'n', handler).withPath('///').getPath()).toBe('/');
    });

    it('manages request methods, with defaults and de-duplication', () => {
        const route = new Route('/users', 'n', handler);

        expect(route.getRequestMethods()).toStrictEqual([RequestMethod.HEAD, RequestMethod.GET]);
        expect(route.hasRequestMethod(RequestMethod.GET)).toBe(true);
        expect(route.hasRequestMethod(RequestMethod.POST)).toBe(false);
        expect(route.withRequestMethods(RequestMethod.POST).getRequestMethods()).toStrictEqual([RequestMethod.POST]);
        expect(route.withAddedRequestMethods(RequestMethod.GET, RequestMethod.POST).getRequestMethods()).toStrictEqual([
            RequestMethod.HEAD,
            RequestMethod.GET,
            RequestMethod.POST,
        ]);
    });

    it('manages each middleware group immutably', () => {
        const route = new Route('/users', 'n', handler);

        expect(route.withRouteMatchedMiddleware(Middleware).getRouteMatchedMiddleware()).toStrictEqual([Middleware]);
        expect(
            route
                .withRouteMatchedMiddleware(Middleware)
                .withAddedRouteMatchedMiddleware(Middleware)
                .getRouteMatchedMiddleware(),
        ).toHaveLength(2);

        expect(route.withRouteDispatchedMiddleware(Middleware).getRouteDispatchedMiddleware()).toStrictEqual([
            Middleware,
        ]);
        expect(
            route
                .withRouteDispatchedMiddleware(Middleware)
                .withAddedRouteDispatchedMiddleware(Middleware)
                .getRouteDispatchedMiddleware(),
        ).toHaveLength(2);

        expect(route.withThrowableCaughtMiddleware(Middleware).getThrowableCaughtMiddleware()).toStrictEqual([
            Middleware,
        ]);
        expect(
            route
                .withThrowableCaughtMiddleware(Middleware)
                .withAddedThrowableCaughtMiddleware(Middleware)
                .getThrowableCaughtMiddleware(),
        ).toHaveLength(2);

        expect(route.withSendingResponseMiddleware(Middleware).getSendingResponseMiddleware()).toStrictEqual([
            Middleware,
        ]);
        expect(
            route
                .withSendingResponseMiddleware(Middleware)
                .withAddedSendingResponseMiddleware(Middleware)
                .getSendingResponseMiddleware(),
        ).toHaveLength(2);

        expect(route.withResponseSentMiddleware(Middleware).getResponseSentMiddleware()).toStrictEqual([Middleware]);
        expect(
            route
                .withResponseSentMiddleware(Middleware)
                .withAddedResponseSentMiddleware(Middleware)
                .getResponseSentMiddleware(),
        ).toHaveLength(2);
    });

    it('manages the request and response structs, throwing when absent', () => {
        const route = new Route('/users', 'n', handler);
        const requestStruct = {} as RequestStructContract;
        const responseStruct = {} as ResponseStructContract;

        expect(route.hasRequestStruct()).toBe(false);
        expect(() => route.getRequestStruct()).toThrow(HttpRoutingNoRequestStructException);
        expect(route.withRequestStruct(requestStruct).getRequestStruct()).toBe(requestStruct);

        expect(route.hasResponseStruct()).toBe(false);
        expect(() => route.getResponseStruct()).toThrow(HttpRoutingNoResponseStructException);
        expect(route.withResponseStruct(responseStruct).getResponseStruct()).toBe(responseStruct);
    });
});
