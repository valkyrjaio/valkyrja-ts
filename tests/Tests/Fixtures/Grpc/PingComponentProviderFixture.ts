/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { ServiceResponse } from '../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Route } from '../../../../src/Valkyrja/Grpc/Routing/Data/Route.ts';
import { RecordingResponseSentMiddlewareFixture } from './Middleware/RecordingResponseSentMiddlewareFixture.ts';
import { RespondingSendingResponseMiddlewareFixture } from './Middleware/RespondingSendingResponseMiddlewareFixture.ts';

import type { ApplicationContract } from '../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { RouteContract } from '../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';
import type { GrpcRouteProviderContract } from '../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';

/** The fully-qualified method the ping route answers. */
export const PING_METHOD = '/test.Ping/Ping';

/** The fully-qualified method whose route carries per-route always-run middleware. */
export const DECORATED_METHOD = '/test.Ping/Decorated';

/** A route provider serving a unary ping, plus a route carrying per-route middleware. */
class PingGrpcRouteProviderFixture implements GrpcRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [
            new Route(PING_METHOD, () => Promise.resolve(ServiceResponse.ok('pong'))),
            new Route(DECORATED_METHOD, () => Promise.resolve(ServiceResponse.ok('decorated')))
                .withAddedSendingResponseMiddleware(RespondingSendingResponseMiddlewareFixture)
                .withAddedResponseSentMiddleware(RecordingResponseSentMiddlewareFixture),
        ];
    }
}

/**
 * Publishes the per-route middleware into the container.
 *
 * Route middleware is resolved from the container by class name, so an application that attaches
 * middleware to a route must also register it — naming a class on a route does not register it.
 */
class PingGrpcServiceProviderFixture implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [RespondingSendingResponseMiddlewareFixture.name]: (container: ContainerContract): void => {
                container.setSingleton(
                    RespondingSendingResponseMiddlewareFixture.name,
                    new RespondingSendingResponseMiddlewareFixture(),
                );
            },
            [RecordingResponseSentMiddlewareFixture.name]: (container: ContainerContract): void => {
                container.setSingleton(
                    RecordingResponseSentMiddlewareFixture.name,
                    new RecordingResponseSentMiddlewareFixture(),
                );
            },
        };
    }
}

/**
 * Registers the ping route provider with the application, so a booted app dispatches a gRPC call
 * end to end without depending on generated routing data.
 */
export class PingComponentProviderFixture extends ComponentProvider {
    override getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [new PingGrpcRouteProviderFixture()];
    }

    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new PingGrpcServiceProviderFixture()];
    }
}
