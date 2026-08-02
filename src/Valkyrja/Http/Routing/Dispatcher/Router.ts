/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Container } from '../../../Container/Manager/Container.ts';
import { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import { StatusCode } from '../../Message/Enum/StatusCode.ts';
import { ResponseFactory } from '../../Message/Response/Factory/ResponseFactory.ts';
import { RouteDispatchedHandler } from '../../Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../Middleware/Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../../Middleware/Handler/SendingResponseHandler.ts';
import { ResponseSentHandler } from '../../Middleware/Handler/ResponseSentHandler.ts';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.ts';
import { Matcher } from '../Matcher/Matcher.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.ts';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { MatcherContract } from '../Matcher/Contract/MatcherContract.ts';
import type { RouterContract } from './Contract/RouterContract.ts';

export class Router implements RouterContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected matcher: MatcherContract = new Matcher(),
        protected responseFactory: ResponseFactoryContract = new ResponseFactory(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected routeMatchedHandler: RouteMatchedHandlerContract = new RouteMatchedHandler(),
        protected routeNotMatchedHandler: RouteNotMatchedHandlerContract = new RouteNotMatchedHandler(),
        protected routeDispatchedHandler: RouteDispatchedHandlerContract = new RouteDispatchedHandler(),
        protected sendingResponseHandler: SendingResponseHandlerContract = new SendingResponseHandler(),
        protected responseSentHandler: ResponseSentHandlerContract = new ResponseSentHandler(),
    ) {}

    dispatch(request: ServerRequestContract): ResponseContract {
        const matchedRoute = this.attemptToMatchRoute(request);

        if (!(matchedRoute instanceof Object && 'getPath' in matchedRoute)) {
            return this.routeNotMatchedHandler.routeNotMatched(request, matchedRoute);
        }

        return this.dispatchRoute(request, matchedRoute);
    }

    dispatchRoute(request: ServerRequestContract, route: RouteContract): ResponseContract {
        this.routeMatched(route);

        const routeAfterMiddleware = this.routeMatchedHandler.routeMatched(request, route);

        if (!('getPath' in routeAfterMiddleware)) {
            return routeAfterMiddleware;
        }

        const matchedRoute = routeAfterMiddleware;

        this.container.setSingleton('RouteContract', matchedRoute);

        const handler = matchedRoute.getHandler();
        const response = handler(this.container, matchedRoute);

        return this.routeDispatchedHandler.routeDispatched(request, response, matchedRoute);
    }

    protected attemptToMatchRoute(request: ServerRequestContract): RouteContract | ResponseContract {
        const requestPath = decodeURIComponent(request.getUri().getPath());
        const route = this.matcher.match(requestPath, request.getMethod());

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
        this.responseSentHandler.add(...route.getResponseSentMiddleware());

        this.container.setSingleton('RouteContract', route);
    }
}
