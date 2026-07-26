/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import { Response } from '../../Message/Response/Response.ts';
import { readHttpRouteMetadata } from '../Attribute/RouteAttributeMetadata.ts';
import { DynamicRoute } from '../Data/DynamicRoute.ts';
import { Parameter } from '../Data/Parameter.ts';
import { Route } from '../Data/Route.ts';
import { Processor } from '../Processor/Processor.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type {
    HttpHandlerReference,
    HttpMiddlewareReference,
    HttpRouteDefinition,
    HttpRouteMethodMetadata,
} from '../Attribute/RouteAttributeMetadata.ts';
import type { ParameterOptions } from '../Attribute/RouteOptions.ts';
import type { ParameterContract } from '../Data/Contract/ParameterContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { ProcessorContract } from '../Processor/Contract/ProcessorContract.ts';
import type { RouteCollectorContract } from './Contract/RouteCollectorContract.ts';

type HttpHandler = (container: ContainerContract, route: RouteContract) => ResponseContract;

/**
 * Builds routes from the decorator metadata attached to controller classes,
 * without executing or re-parsing any source.
 *
 * Mirrors the framework's PHP `AttributeRouteCollector`, but reads the standard
 * Stage-3 decorator metadata (`Controller[Symbol.metadata]`) that the routing
 * decorators write, in place of PHP's runtime reflection. Used on the uncached
 * (debug) path; the cached path uses the Sindri-generated data instead.
 */
export class AttributeRouteCollector implements RouteCollectorContract {
    constructor(protected processor: ProcessorContract = new Processor()) {}

    getRoutes(...classes: Array<new (...args: unknown[]) => unknown>): RouteContract[] {
        const routes: RouteContract[] = [];

        for (const controller of classes) {
            const metadata = readHttpRouteMetadata(controller);

            if (metadata === null) {
                continue;
            }

            const classPath = metadata.classPaths[0] ?? '';
            const className = metadata.classNames[0] ?? '';

            for (const method of metadata.methods.values()) {
                for (const definition of method.routes) {
                    routes.push(this.processor.route(this.buildRoute(definition, method, classPath, className)));
                }
            }
        }

        return routes;
    }

    protected buildRoute(
        definition: HttpRouteDefinition,
        method: HttpRouteMethodMetadata,
        classPath: string,
        className: string,
    ): RouteContract {
        const handler = this.resolveHandler(method.handler ?? definition.handler);
        const requestMethods =
            definition.requestMethods.length > 0
                ? [...definition.requestMethods]
                : [RequestMethod.HEAD, RequestMethod.GET];

        let route: RouteContract = definition.dynamic
            ? new DynamicRoute(
                  definition.path,
                  definition.name,
                  '',
                  this.buildParameters(definition.parameters),
                  handler,
                  requestMethods,
              )
            : new Route(definition.path, definition.name, handler, requestMethods);

        route = this.applyPath(route, classPath, method.paths);
        route = this.applyName(route, className, method.names);
        route = route.withAddedRequestMethods(...method.addedRequestMethods);
        route = this.applyMiddleware(route, [...definition.middleware, ...method.middleware]);
        route = this.applyStructs(route, definition, method);

        return route;
    }

    protected resolveHandler(reference: HttpHandlerReference | null): HttpHandler {
        if (reference === null) {
            return AttributeRouteCollector.defaultHandler;
        }

        const [provider, methodName] = reference;
        const handler = (provider as unknown as Record<string, HttpHandler | undefined>)[methodName];

        return handler ?? AttributeRouteCollector.defaultHandler;
    }

    protected applyPath(route: RouteContract, classPath: string, methodPaths: string[]): RouteContract {
        if (classPath !== '') {
            route = route.withPath(classPath + route.getPath());
        }

        const methodPath = methodPaths[0];

        if (methodPath !== undefined) {
            route = route.withAddedPath(methodPath);
        }

        return route;
    }

    protected applyName(route: RouteContract, className: string, methodNames: string[]): RouteContract {
        if (className !== '') {
            route = route.withName(className + '.' + route.getName());
        }

        const methodName = methodNames[0];

        if (methodName !== undefined) {
            route = route.withName(route.getName() + '.' + methodName);
        }

        return route;
    }

    protected applyMiddleware(route: RouteContract, middleware: HttpMiddlewareReference[]): RouteContract {
        for (const reference of middleware) {
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

    protected applyStructs(
        route: RouteContract,
        definition: HttpRouteDefinition,
        method: HttpRouteMethodMetadata,
    ): RouteContract {
        const requestStruct = method.requestStruct ?? definition.requestStruct;

        if (requestStruct !== null) {
            route = route.withRequestStruct(requestStruct);
        }

        const responseStruct = method.responseStruct ?? definition.responseStruct;

        if (responseStruct !== null) {
            route = route.withResponseStruct(responseStruct);
        }

        return route;
    }

    protected buildParameters(parameters: ParameterOptions[]): ParameterContract[] {
        return parameters.map(
            (parameter) =>
                new Parameter(
                    parameter.name,
                    parameter.regex,
                    parameter.cast ?? null,
                    parameter.isOptional ?? false,
                    parameter.shouldCapture ?? true,
                    parameter.default ?? null,
                ),
        );
    }

    protected static defaultHandler(this: void): ResponseContract {
        return new Response();
    }
}
