import { Container } from '../../../Container/Manager/Container.js';
import { RequestMethod } from '../../Message/Enum/RequestMethod.js';
import { StatusCode } from '../../Message/Enum/StatusCode.js';
import { ResponseFactory } from '../../Message/Response/Factory/ResponseFactory.js';
import { RouteDispatchedHandler } from '../../Middleware/Handler/RouteDispatchedHandler.js';
import { RouteMatchedHandler } from '../../Middleware/Handler/RouteMatchedHandler.js';
import { RouteNotMatchedHandler } from '../../Middleware/Handler/RouteNotMatchedHandler.js';
import { SendingResponseHandler } from '../../Middleware/Handler/SendingResponseHandler.js';
import { TerminatedHandler } from '../../Middleware/Handler/TerminatedHandler.js';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.js';
import { Matcher } from '../Matcher/Matcher.js';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.js';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.js';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.js';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.js';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.js';
import type { TerminatedHandlerContract } from '../../Middleware/Handler/Contract/TerminatedHandlerContract.js';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import type { RouteContract } from '../Data/Contract/RouteContract.js';
import type { MatcherContract } from '../Matcher/Contract/MatcherContract.js';
import type { RouterContract } from './Contract/RouterContract.js';

export class Router implements RouterContract {
    constructor(
        protected container: ContainerContract                          = new Container(),
        protected matcher: MatcherContract                             = new Matcher(),
        protected responseFactory: ResponseFactoryContract             = new ResponseFactory(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected routeMatchedHandler: RouteMatchedHandlerContract     = new RouteMatchedHandler(),
        protected routeNotMatchedHandler: RouteNotMatchedHandlerContract = new RouteNotMatchedHandler(),
        protected routeDispatchedHandler: RouteDispatchedHandlerContract = new RouteDispatchedHandler(),
        protected sendingResponseHandler: SendingResponseHandlerContract = new SendingResponseHandler(),
        protected terminatedHandler: TerminatedHandlerContract         = new TerminatedHandler(),
    ) {}

    dispatch(request: ServerRequestContract): ResponseContract {
        const matchedRoute = this.attemptToMatchRoute(request);

        if (!(matchedRoute instanceof Object && 'getPath' in matchedRoute)) {
            return this.routeNotMatchedHandler.routeNotMatched(
                request,
                matchedRoute as ResponseContract
            );
        }

        return this.dispatchRoute(request, matchedRoute as RouteContract);
    }

    dispatchRoute(request: ServerRequestContract, route: RouteContract): ResponseContract {
        this.routeMatched(route);

        const routeAfterMiddleware = this.routeMatchedHandler.routeMatched(request, route);

        if (!('getPath' in routeAfterMiddleware)) {
            return routeAfterMiddleware as ResponseContract;
        }

        const matchedRoute = routeAfterMiddleware as RouteContract;

        this.container.setSingleton('RouteContract', matchedRoute);

        const handler  = matchedRoute.getHandler();
        const response = handler(this.container, matchedRoute);

        return this.routeDispatchedHandler.routeDispatched(request, response, matchedRoute);
    }

    protected attemptToMatchRoute(request: ServerRequestContract): RouteContract | ResponseContract {
        const requestPath = decodeURIComponent(request.getUri().getPath());
        const route       = this.matcher.match(requestPath, request.getMethod());

        if (route !== null) {
            return route;
        }

        if (this.matcher.match(requestPath, RequestMethod.ANY) !== null) {
            return this.responseFactory.createResponse(null, StatusCode.METHOD_NOT_ALLOWED);
        }

        return this.responseFactory.createResponse(null, StatusCode.NOT_FOUND);
    }

    protected routeMatched(route: RouteContract): void {
        this.routeMatchedHandler.add(...route.getRouteMatchedMiddleware());
        this.routeDispatchedHandler.add(...route.getRouteDispatchedMiddleware());
        this.throwableCaughtHandler.add(...route.getThrowableCaughtMiddleware());
        this.sendingResponseHandler.add(...route.getSendingResponseMiddleware());
        this.terminatedHandler.add(...route.getTerminatedMiddleware());

        this.container.setSingleton('RouteContract', route);
    }
}