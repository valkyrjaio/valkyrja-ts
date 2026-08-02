/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import { HttpMiddlewareServiceId } from '../../Middleware/Constant/HttpMiddlewareServiceId.ts';
import type { RequestReceivedHandlerContract } from '../../Middleware/Handler/Contract/RequestReceivedHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import { HttpRoutingServiceId } from '../../Routing/Constant/HttpRoutingServiceId.ts';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.ts';
import { HttpServerServiceId } from '../Constant/HttpServerServiceId.ts';
import type { RequestHandlerContract } from '../Handler/Contract/RequestHandlerContract.ts';
import { RequestHandler } from '../Handler/RequestHandler.ts';

export class HttpServerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [HttpServerServiceId.RequestHandlerContract]: HttpServerServiceProvider.publishRequestHandler,
        };
    }

    static publishRequestHandler(this: void, container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        container.setSingleton<RequestHandlerContract>(
            HttpServerServiceId.RequestHandlerContract,
            new RequestHandler(
                container,
                container.getSingleton<RouterContract>(HttpRoutingServiceId.RouterContract),
                container.getSingleton<RequestReceivedHandlerContract>(
                    HttpMiddlewareServiceId.RequestReceivedHandlerContract,
                ),
                container.getSingleton<ThrowableCaughtHandlerContract>(
                    HttpMiddlewareServiceId.ThrowableCaughtHandlerContract,
                ),
                container.getSingleton<SendingResponseHandlerContract>(
                    HttpMiddlewareServiceId.SendingResponseHandlerContract,
                ),
                container.getSingleton<ResponseSentHandlerContract>(
                    HttpMiddlewareServiceId.ResponseSentHandlerContract,
                ),
                app.getDebugMode(),
            ),
        );
    }
}
