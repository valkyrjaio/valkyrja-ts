/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { readGrpcRouteMetadata } from '../Attribute/RouteAttributeMetadata.ts';
import { Route } from '../Data/Route.ts';
import { GrpcRoutingNoRouteHandlerException } from '../Throwable/Exception/GrpcRoutingNoRouteHandlerException.ts';

import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type {
    GrpcHandler,
    GrpcMethodMetadata,
    GrpcMiddlewareReference,
    GrpcRouteDefinition,
} from '../Attribute/RouteAttributeMetadata.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouteCollectorContract } from './Contract/RouteCollectorContract.ts';

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
                for (const definition of method.routes) {
                    routes.push(this.buildRoute(definition, service, method, controller, methodName));
                }
            }
        }

        return routes;
    }

    protected buildRoute(
        definition: GrpcRouteDefinition,
        service: string,
        method: GrpcMethodMetadata,
        controller: new (...args: unknown[]) => unknown,
        methodName: string,
    ): RouteContract {
        const fullMethod = `/${service}/${definition.name}`;

        let route: RouteContract = new Route(
            fullMethod,
            this.resolveHandler(definition, method, fullMethod, controller, methodName),
        )
            .withRequestType(definition.requestType)
            .withResponseType(definition.responseType)
            .withClientStreaming(definition.clientStreaming)
            .withServerStreaming(definition.serverStreaming);

        // Each per-stage list names its own stage, so it needs no classification. The stageless
        // `@Middleware` decorator does, because the stages come from the class.
        route = this.applyStageMiddleware(route, definition);

        return this.applyMiddleware(route, method.middleware);
    }

    /** Add each middleware a per-stage argument names, to the stage the argument names. */
    protected applyStageMiddleware(route: RouteContract, definition: GrpcRouteDefinition): RouteContract {
        for (const thunk of definition.routeMatchedMiddleware) {
            route = route.withAddedRouteMatchedMiddleware(thunk() as new (...args: unknown[]) => never);
        }

        for (const thunk of definition.routeDispatchedMiddleware) {
            route = route.withAddedRouteDispatchedMiddleware(thunk() as new (...args: unknown[]) => never);
        }

        for (const thunk of definition.throwableCaughtMiddleware) {
            route = route.withAddedThrowableCaughtMiddleware(thunk() as new (...args: unknown[]) => never);
        }

        for (const thunk of definition.sendingResponseMiddleware) {
            route = route.withAddedSendingResponseMiddleware(thunk() as new (...args: unknown[]) => never);
        }

        for (const thunk of definition.responseSentMiddleware) {
            route = route.withAddedResponseSentMiddleware(thunk() as new (...args: unknown[]) => never);
        }

        return route;
    }

    /**
     * Resolve the handler a route declares.
     *
     * The handler is a single-valued field with two spellings, so `@RouteHandler` wins over the
     * `handler` option on `@Route`. A route that names neither is rejected here, rather than
     * served as a route that answers nothing.
     *
     * The stored reference is a `[thunk, methodName]` pair. The first element is a thunk, which
     * defers the class dereference past the decorator's temporal dead zone. The collector therefore
     * calls the thunk to get the class before it reads the method off that class.
     *
     * @throws GrpcRoutingNoRouteHandlerException when the route names no handler, or when the
     *     named handler is absent from the class the reference points at
     */
    protected resolveHandler(
        definition: GrpcRouteDefinition,
        method: GrpcMethodMetadata,
        fullMethod: string,
        controller: new (...args: unknown[]) => unknown,
        methodName: string,
    ): GrpcHandler {
        const reference = method.handler ?? definition.handler;

        if (reference === null) {
            throw new GrpcRoutingNoRouteHandlerException(
                `Route ${fullMethod}, declared by ${controller.name}.${methodName}, names no handler. ` +
                    'Name one through the `handler` option or the `@RouteHandler` decorator.',
            );
        }

        const [provider, name] = reference;
        const handler = (provider() as Record<string, GrpcHandler | undefined>)[name];

        if (handler === undefined) {
            throw new GrpcRoutingNoRouteHandlerException(
                `Route ${fullMethod}, declared by ${controller.name}.${methodName}, names the handler ` +
                    `'${name}', which the referenced class does not declare.`,
            );
        }

        return handler;
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
}
