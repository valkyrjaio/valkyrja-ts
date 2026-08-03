/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../../Container/Manager/Container.ts';
import { RouteCollection } from '../Collection/RouteCollection.ts';
import { ResponseSentHandler } from '../../Middleware/Handler/ResponseSentHandler.ts';
import { RouteDispatchedHandler } from '../../Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../Middleware/Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../../Middleware/Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.ts';
import { GrpcMessageServiceId } from '../../Message/Constant/GrpcMessageServiceId.ts';
import { ServiceResponse } from '../../Message/Response/ServiceResponse.ts';
import { Cancellation } from '../../Support/Cancellation.ts';
import { GrpcRoutingServiceId } from '../Constant/GrpcRoutingServiceId.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouterContract } from './Contract/RouterContract.ts';

/**
 * Resolves an inbound call via a direct service-map lookup and dispatches it through the per-route
 * middleware stages. A missing entry routes to `RouteNotMatched` (default terminal: `UNIMPLEMENTED`).
 * The two-question cancellation check runs before delegating to `RouteMatched` and after the user
 * handler returns, so a cancelled call fast-exits the request-processing stages.
 */
export class Router implements RouterContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected collection: RouteCollectionContract = new RouteCollection(),
        protected routeMatchedHandler: RouteMatchedHandlerContract = new RouteMatchedHandler(),
        protected routeNotMatchedHandler: RouteNotMatchedHandlerContract = new RouteNotMatchedHandler(),
        protected routeDispatchedHandler: RouteDispatchedHandlerContract = new RouteDispatchedHandler(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected sendingResponseHandler: SendingResponseHandlerContract = new SendingResponseHandler(),
        protected responseSentHandler: ResponseSentHandlerContract = new ResponseSentHandler(),
    ) {}

    async dispatch(call: ServiceCallContract): Promise<ServiceResponseContract> {
        const method = call.getMethod();

        if (!this.collection.has(method)) {
            return this.routeNotMatchedHandler.routeNotMatched(call, ServiceResponse.unimplemented());
        }

        return this.dispatchRoute(call, this.collection.get(method));
    }

    protected async dispatchRoute(call: ServiceCallContract, route: RouteContract): Promise<ServiceResponseContract> {
        this.registerRouteMiddleware(route);

        const routedCall = call.withRoute(route);

        this.container.setSingleton<ServiceCallContract>(GrpcMessageServiceId.ServiceCallContract, routedCall);

        const preCheck = Cancellation.checkAndFinalize(routedCall);

        if (preCheck !== null) {
            return preCheck;
        }

        const matched = await this.routeMatchedHandler.routeMatched(routedCall, route);

        if (matched.response !== null) {
            return matched.response;
        }

        const matchedRoute = matched.route;

        this.container.setSingleton<RouteContract>(GrpcRoutingServiceId.RouteContract, matchedRoute);

        const response = await matchedRoute.getHandler()(this.container, matchedRoute);
        const postCheck = Cancellation.checkAndFinalize(routedCall, response);

        if (postCheck !== null) {
            return postCheck;
        }

        return this.routeDispatchedHandler.routeDispatched(routedCall, response, matchedRoute);
    }

    protected registerRouteMiddleware(route: RouteContract): void {
        this.routeMatchedHandler.add(...route.getRouteMatchedMiddleware());
        this.routeDispatchedHandler.add(...route.getRouteDispatchedMiddleware());
        this.throwableCaughtHandler.add(...route.getThrowableCaughtMiddleware());
        this.sendingResponseHandler.add(...route.getSendingResponseMiddleware());
        this.responseSentHandler.add(...route.getResponseSentMiddleware());
    }
}
