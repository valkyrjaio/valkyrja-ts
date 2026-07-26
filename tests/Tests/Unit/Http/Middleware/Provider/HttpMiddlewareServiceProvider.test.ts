/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { HttpMiddlewareServiceId } from '../../../../../../src/Valkyrja/Http/Middleware/Constant/HttpMiddlewareServiceId.ts';
import { RequestReceivedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RequestReceivedHandler.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ResponseSentHandler.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ThrowableCaughtHandler.ts';
import { HttpMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Http/Middleware/Provider/HttpMiddlewareServiceProvider.ts';

describe('HttpMiddlewareServiceProvider', () => {
    it('publishes all seven middleware handler ids', () => {
        const publishers = new HttpMiddlewareServiceProvider().publishers();

        expect(Object.keys(publishers)).toHaveLength(7);
    });

    it.each([
        [
            HttpMiddlewareServiceProvider.publishRequestReceivedHandler,
            HttpMiddlewareServiceId.RequestReceivedHandlerContract,
            RequestReceivedHandler,
        ],
        [
            HttpMiddlewareServiceProvider.publishThrowableCaughtHandler,
            HttpMiddlewareServiceId.ThrowableCaughtHandlerContract,
            ThrowableCaughtHandler,
        ],
        [
            HttpMiddlewareServiceProvider.publishRouteMatchedHandler,
            HttpMiddlewareServiceId.RouteMatchedHandlerContract,
            RouteMatchedHandler,
        ],
        [
            HttpMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            HttpMiddlewareServiceId.RouteNotMatchedHandlerContract,
            RouteNotMatchedHandler,
        ],
        [
            HttpMiddlewareServiceProvider.publishRouteDispatchedHandler,
            HttpMiddlewareServiceId.RouteDispatchedHandlerContract,
            RouteDispatchedHandler,
        ],
        [
            HttpMiddlewareServiceProvider.publishSendingResponseHandler,
            HttpMiddlewareServiceId.SendingResponseHandlerContract,
            SendingResponseHandler,
        ],
        [
            HttpMiddlewareServiceProvider.publishResponseSentHandler,
            HttpMiddlewareServiceId.ResponseSentHandlerContract,
            ResponseSentHandler,
        ],
    ])('registers the middleware handler singleton', (publish, id, handlerClass) => {
        const container = new Container();

        publish(container);

        expect(container.getSingleton(id)).toBeInstanceOf(handlerClass);
    });
});
