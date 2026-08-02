/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import { GrpcMiddlewareServiceId } from '../../Middleware/Constant/GrpcMiddlewareServiceId.ts';
import { GrpcRoutingServiceId } from '../../Routing/Constant/GrpcRoutingServiceId.ts';
import { GrpcServerServiceId } from '../Constant/GrpcServerServiceId.ts';
import { ServiceHandler } from '../Handler/ServiceHandler.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { CallReceivedHandlerContract } from '../../Middleware/Handler/Contract/CallReceivedHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.ts';
import type { ServiceHandlerContract } from '../Handler/Contract/ServiceHandlerContract.ts';

/** Publishes the gRPC `ServiceHandler`, wired to the shared stage-handler singletons. */
export class GrpcServerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [GrpcServerServiceId.ServiceHandlerContract]: GrpcServerServiceProvider.publishServiceHandler,
        };
    }

    static publishServiceHandler(this: void, container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        container.setSingleton<ServiceHandlerContract>(
            GrpcServerServiceId.ServiceHandlerContract,
            new ServiceHandler(
                container,
                container.getSingleton<RouterContract>(GrpcRoutingServiceId.RouterContract),
                container.getSingleton<CallReceivedHandlerContract>(
                    GrpcMiddlewareServiceId.CallReceivedHandlerContract,
                ),
                container.getSingleton<ThrowableCaughtHandlerContract>(
                    GrpcMiddlewareServiceId.ThrowableCaughtHandlerContract,
                ),
                container.getSingleton<SendingResponseHandlerContract>(
                    GrpcMiddlewareServiceId.SendingResponseHandlerContract,
                ),
                container.getSingleton<ResponseSentHandlerContract>(
                    GrpcMiddlewareServiceId.ResponseSentHandlerContract,
                ),
                app.getDebugMode(),
            ),
        );
    }
}
