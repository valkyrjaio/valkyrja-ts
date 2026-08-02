/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import { GrpcMiddlewareServiceId } from '../Constant/GrpcMiddlewareServiceId.ts';
import { CallReceivedHandler } from '../Handler/CallReceivedHandler.ts';
import { ResponseSentHandler } from '../Handler/ResponseSentHandler.ts';
import { RouteDispatchedHandler } from '../Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../Handler/ThrowableCaughtHandler.ts';

import type { GrpcConfigContract } from '../../../Application/Data/Contract/GrpcConfigContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { CallReceivedHandlerContract } from '../Handler/Contract/CallReceivedHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../Handler/Contract/ResponseSentHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';

/**
 * Publishes the seven gRPC stage handlers as container singletons, each seeded with the middleware
 * from the gRPC config. Because they are singletons, the `Router` and `ServiceHandler` resolve the
 * same instances, so per-route middleware registered onto them fires.
 */
export class GrpcMiddlewareServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [GrpcMiddlewareServiceId.CallReceivedHandlerContract]:
                GrpcMiddlewareServiceProvider.publishCallReceivedHandler,
            [GrpcMiddlewareServiceId.RouteMatchedHandlerContract]:
                GrpcMiddlewareServiceProvider.publishRouteMatchedHandler,
            [GrpcMiddlewareServiceId.RouteNotMatchedHandlerContract]:
                GrpcMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            [GrpcMiddlewareServiceId.RouteDispatchedHandlerContract]:
                GrpcMiddlewareServiceProvider.publishRouteDispatchedHandler,
            [GrpcMiddlewareServiceId.ThrowableCaughtHandlerContract]:
                GrpcMiddlewareServiceProvider.publishThrowableCaughtHandler,
            [GrpcMiddlewareServiceId.SendingResponseHandlerContract]:
                GrpcMiddlewareServiceProvider.publishSendingResponseHandler,
            [GrpcMiddlewareServiceId.ResponseSentHandlerContract]:
                GrpcMiddlewareServiceProvider.publishResponseSentHandler,
        };
    }

    static publishCallReceivedHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<CallReceivedHandlerContract>(
            GrpcMiddlewareServiceId.CallReceivedHandlerContract,
            new CallReceivedHandler(container, ...config.callReceivedMiddleware),
        );
    }

    static publishRouteMatchedHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<RouteMatchedHandlerContract>(
            GrpcMiddlewareServiceId.RouteMatchedHandlerContract,
            new RouteMatchedHandler(container, ...config.routeMatchedMiddleware),
        );
    }

    static publishRouteNotMatchedHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<RouteNotMatchedHandlerContract>(
            GrpcMiddlewareServiceId.RouteNotMatchedHandlerContract,
            new RouteNotMatchedHandler(container, ...config.routeNotMatchedMiddleware),
        );
    }

    static publishRouteDispatchedHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<RouteDispatchedHandlerContract>(
            GrpcMiddlewareServiceId.RouteDispatchedHandlerContract,
            new RouteDispatchedHandler(container, ...config.routeDispatchedMiddleware),
        );
    }

    static publishThrowableCaughtHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<ThrowableCaughtHandlerContract>(
            GrpcMiddlewareServiceId.ThrowableCaughtHandlerContract,
            new ThrowableCaughtHandler(container, ...config.throwableCaughtMiddleware),
        );
    }

    static publishSendingResponseHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<SendingResponseHandlerContract>(
            GrpcMiddlewareServiceId.SendingResponseHandlerContract,
            new SendingResponseHandler(container, ...config.sendingResponseMiddleware),
        );
    }

    static publishResponseSentHandler(this: void, container: ContainerContract): void {
        const config = GrpcMiddlewareServiceProvider.getConfig(container);

        container.setSingleton<ResponseSentHandlerContract>(
            GrpcMiddlewareServiceId.ResponseSentHandlerContract,
            new ResponseSentHandler(container, ...config.responseSentMiddleware),
        );
    }

    protected static getConfig(container: ContainerContract): GrpcConfigContract {
        return container.getSingleton<GrpcConfigContract>(ApplicationServiceId.GrpcConfigContract);
    }
}
