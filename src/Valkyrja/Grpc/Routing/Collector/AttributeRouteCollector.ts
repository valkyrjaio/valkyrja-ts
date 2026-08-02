/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '../../Message/Response/ServiceResponse.ts';
import { readGrpcRouteMetadata } from '../Attribute/RouteAttributeMetadata.ts';
import { Route } from '../Data/Route.ts';

import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type {
    GrpcHandler,
    GrpcHandlerReferenceMetadata,
    GrpcMethodDefinition,
    GrpcMiddlewareReference,
} from '../Attribute/RouteAttributeMetadata.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouteCollectorContract } from './Contract/RouteCollectorContract.ts';

/**
 * Builds gRPC routes from the decorator metadata on controller classes. The collector does not
 * execute or re-parse any source.
 *
 * The collector mirrors the Java reference `AttributeRouteCollector`. It reads the Stage-3 decorator
 * metadata (`Controller[Symbol.metadata]`) that the gRPC routing decorators write. The uncached
 * (debug) path uses the collector; the cached path uses the generated service map.
 */
export class AttributeRouteCollector implements RouteCollectorContract {
    getRoutes(...classes: Array<new (...args: unknown[]) => unknown>): RouteContract[] {
        const routes: RouteContract[] = [];

        for (const controller of classes) {
            const metadata = readGrpcRouteMetadata(controller);

            if (metadata === null) {
                continue;
            }

            const service = metadata.services[0];

            // A controller without an @Service decorator names no service, so it can key no route.
            if (service === undefined) {
                continue;
            }

            for (const [methodName, method] of metadata.methods) {
                for (const definition of method.methods) {
                    routes.push(this.buildRoute(definition, service, method.middleware, controller, methodName));
                }
            }
        }

        return routes;
    }

    protected buildRoute(
        definition: GrpcMethodDefinition,
        service: string,
        methodMiddleware: GrpcMiddlewareReference[],
        controller: new (...args: unknown[]) => unknown,
        methodName: string,
    ): RouteContract {
        let route: RouteContract = new Route(
            `/${service}/${definition.name}`,
            this.resolveHandler(definition.handler, controller, methodName),
        )
            .withClientStreaming(definition.clientStreaming)
            .withServerStreaming(definition.serverStreaming);

        route = this.applyMiddleware(route, [...definition.middleware, ...methodMiddleware]);

        return route;
    }

    /**
     * Resolve the handler for a method.
     *
     * A `@Method` decorator that names no handler falls back to the static method of the same name
     * on the controller. `sindri` emits the same fallback into the generated service map, so the
     * cached path and the debug path resolve one handler. A controller that declares no such static
     * method gets a handler that answers `UNIMPLEMENTED`.
     *
     * The stored reference is a `[thunk, methodName]` pair. The first element is a thunk, which
     * defers the class dereference past the decorator's temporal dead zone. The collector therefore
     * calls the thunk to get the class before it reads the method off that class.
     */
    protected resolveHandler(
        reference: GrpcHandlerReferenceMetadata | null,
        controller: new (...args: unknown[]) => unknown,
        methodName: string,
    ): GrpcHandler {
        const [provider, name] = reference ?? [(): unknown => controller, methodName];
        const handler = (provider() as Record<string, GrpcHandler | undefined>)[name];

        return handler ?? AttributeRouteCollector.defaultHandler;
    }

    /**
     * Put each middleware into every stage bucket that the middleware serves.
     *
     * Each check is independent, because one class can serve more than one stage. The collector
     * appends and never dedupes, which matches both the cache generator and the reference port.
     */
    protected applyMiddleware(route: RouteContract, middleware: GrpcMiddlewareReference[]): RouteContract {
        for (const thunk of middleware) {
            // The reference is a thunk, so call it to get the class before reading its prototype.
            const reference = thunk();
            const prototype = reference.prototype as unknown as Record<string, unknown>;

            if (typeof prototype.routeMatched === 'function') {
                route = route.withAddedRouteMatchedMiddleware(
                    reference as new (...args: unknown[]) => RouteMatchedMiddlewareContract,
                );
            }

            if (typeof prototype.routeDispatched === 'function') {
                route = route.withAddedRouteDispatchedMiddleware(
                    reference as new (...args: unknown[]) => RouteDispatchedMiddlewareContract,
                );
            }

            if (typeof prototype.throwableCaught === 'function') {
                route = route.withAddedThrowableCaughtMiddleware(
                    reference as new (...args: unknown[]) => ThrowableCaughtMiddlewareContract,
                );
            }

            if (typeof prototype.sendingResponse === 'function') {
                route = route.withAddedSendingResponseMiddleware(
                    reference as new (...args: unknown[]) => SendingResponseMiddlewareContract,
                );
            }

            if (typeof prototype.responseSent === 'function') {
                route = route.withAddedResponseSentMiddleware(
                    reference as new (...args: unknown[]) => ResponseSentMiddlewareContract,
                );
            }
        }

        return route;
    }

    protected static defaultHandler(this: void): Promise<ServiceResponse> {
        return Promise.resolve(ServiceResponse.unimplemented());
    }
}
