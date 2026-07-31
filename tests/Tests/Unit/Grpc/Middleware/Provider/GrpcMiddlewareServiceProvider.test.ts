/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { GrpcMiddlewareServiceId } from '../../../../../../src/Valkyrja/Grpc/Middleware/Constant/GrpcMiddlewareServiceId.ts';
import { CallReceivedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/CallReceivedHandler.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteNotMatchedHandler.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteDispatchedHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ThrowableCaughtHandler.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/SendingResponseHandler.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ResponseSentHandler.ts';
import { GrpcMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Middleware/Provider/GrpcMiddlewareServiceProvider.ts';
import { GrpcConfigFixture } from '../../../../Fixtures/Grpc/GrpcConfigFixture.ts';

const containerWithConfig = (): Container => {
    const container = new Container();

    container.setSingleton(ApplicationServiceId.GrpcConfigContract, new GrpcConfigFixture());

    return container;
};

describe('GrpcMiddlewareServiceProvider', () => {
    it('publishes all seven middleware handler ids', () => {
        expect(Object.keys(new GrpcMiddlewareServiceProvider().publishers())).toHaveLength(7);
    });

    it.each([
        [
            GrpcMiddlewareServiceProvider.publishCallReceivedHandler,
            GrpcMiddlewareServiceId.CallReceivedHandlerContract,
            CallReceivedHandler,
        ],
        [
            GrpcMiddlewareServiceProvider.publishRouteMatchedHandler,
            GrpcMiddlewareServiceId.RouteMatchedHandlerContract,
            RouteMatchedHandler,
        ],
        [
            GrpcMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            GrpcMiddlewareServiceId.RouteNotMatchedHandlerContract,
            RouteNotMatchedHandler,
        ],
        [
            GrpcMiddlewareServiceProvider.publishRouteDispatchedHandler,
            GrpcMiddlewareServiceId.RouteDispatchedHandlerContract,
            RouteDispatchedHandler,
        ],
        [
            GrpcMiddlewareServiceProvider.publishThrowableCaughtHandler,
            GrpcMiddlewareServiceId.ThrowableCaughtHandlerContract,
            ThrowableCaughtHandler,
        ],
        [
            GrpcMiddlewareServiceProvider.publishSendingResponseHandler,
            GrpcMiddlewareServiceId.SendingResponseHandlerContract,
            SendingResponseHandler,
        ],
        [
            GrpcMiddlewareServiceProvider.publishResponseSentHandler,
            GrpcMiddlewareServiceId.ResponseSentHandlerContract,
            ResponseSentHandler,
        ],
    ])('publishes a handler as a singleton', (publish, id, handler) => {
        const container = containerWithConfig();

        publish(container);

        expect(container.getSingleton(id)).toBeInstanceOf(handler);
    });

    it('publishes each handler as the same instance on every resolve, so per-route middleware fires', () => {
        // The Router registers per-route middleware onto these instances and the ServiceHandler
        // invokes them. Resolving two different instances would silently drop that middleware.
        const container = containerWithConfig();

        GrpcMiddlewareServiceProvider.publishSendingResponseHandler(container);

        expect(container.getSingleton(GrpcMiddlewareServiceId.SendingResponseHandlerContract)).toBe(
            container.getSingleton(GrpcMiddlewareServiceId.SendingResponseHandlerContract),
        );
    });
});
