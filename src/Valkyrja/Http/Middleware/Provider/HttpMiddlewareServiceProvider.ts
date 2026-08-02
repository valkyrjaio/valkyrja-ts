/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import { HttpMiddlewareServiceId } from '../Constant/HttpMiddlewareServiceId.ts';
import type { RequestReceivedHandlerContract } from '../Handler/Contract/RequestReceivedHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../Handler/Contract/ResponseSentHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';
import { RequestReceivedHandler } from '../Handler/RequestReceivedHandler.ts';
import { ResponseSentHandler } from '../Handler/ResponseSentHandler.ts';
import { RouteDispatchedHandler } from '../Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../Handler/ThrowableCaughtHandler.ts';

export class HttpMiddlewareServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [HttpMiddlewareServiceId.RequestReceivedHandlerContract]:
                HttpMiddlewareServiceProvider.publishRequestReceivedHandler,
            [HttpMiddlewareServiceId.ThrowableCaughtHandlerContract]:
                HttpMiddlewareServiceProvider.publishThrowableCaughtHandler,
            [HttpMiddlewareServiceId.RouteMatchedHandlerContract]:
                HttpMiddlewareServiceProvider.publishRouteMatchedHandler,
            [HttpMiddlewareServiceId.RouteNotMatchedHandlerContract]:
                HttpMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            [HttpMiddlewareServiceId.RouteDispatchedHandlerContract]:
                HttpMiddlewareServiceProvider.publishRouteDispatchedHandler,
            [HttpMiddlewareServiceId.SendingResponseHandlerContract]:
                HttpMiddlewareServiceProvider.publishSendingResponseHandler,
            [HttpMiddlewareServiceId.ResponseSentHandlerContract]:
                HttpMiddlewareServiceProvider.publishResponseSentHandler,
        };
    }

    static publishRequestReceivedHandler(this: void, container: ContainerContract): void {
        container.setSingleton<RequestReceivedHandlerContract>(
            HttpMiddlewareServiceId.RequestReceivedHandlerContract,
            new RequestReceivedHandler(container),
        );
    }

    static publishThrowableCaughtHandler(this: void, container: ContainerContract): void {
        container.setSingleton<ThrowableCaughtHandlerContract>(
            HttpMiddlewareServiceId.ThrowableCaughtHandlerContract,
            new ThrowableCaughtHandler(container),
        );
    }

    static publishRouteMatchedHandler(this: void, container: ContainerContract): void {
        container.setSingleton<RouteMatchedHandlerContract>(
            HttpMiddlewareServiceId.RouteMatchedHandlerContract,
            new RouteMatchedHandler(container),
        );
    }

    static publishRouteNotMatchedHandler(this: void, container: ContainerContract): void {
        container.setSingleton<RouteNotMatchedHandlerContract>(
            HttpMiddlewareServiceId.RouteNotMatchedHandlerContract,
            new RouteNotMatchedHandler(container),
        );
    }

    static publishRouteDispatchedHandler(this: void, container: ContainerContract): void {
        container.setSingleton<RouteDispatchedHandlerContract>(
            HttpMiddlewareServiceId.RouteDispatchedHandlerContract,
            new RouteDispatchedHandler(container),
        );
    }

    static publishSendingResponseHandler(this: void, container: ContainerContract): void {
        container.setSingleton<SendingResponseHandlerContract>(
            HttpMiddlewareServiceId.SendingResponseHandlerContract,
            new SendingResponseHandler(container),
        );
    }

    static publishResponseSentHandler(this: void, container: ContainerContract): void {
        container.setSingleton<ResponseSentHandlerContract>(
            HttpMiddlewareServiceId.ResponseSentHandlerContract,
            new ResponseSentHandler(container),
        );
    }
}
