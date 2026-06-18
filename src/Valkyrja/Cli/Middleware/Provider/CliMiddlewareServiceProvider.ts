/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import { CliMiddlewareServiceId } from '../Constant/CliMiddlewareServiceId.ts';
import type { ExitedHandlerContract } from '../Handler/Contract/ExitedHandlerContract.ts';
import type { InputReceivedHandlerContract } from '../Handler/Contract/InputReceivedHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';
import { ExitedHandler } from '../Handler/ExitedHandler.ts';
import { InputReceivedHandler } from '../Handler/InputReceivedHandler.ts';
import { RouteDispatchedHandler } from '../Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../Handler/RouteNotMatchedHandler.ts';
import { ThrowableCaughtHandler } from '../Handler/ThrowableCaughtHandler.ts';

export class CliMiddlewareServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliMiddlewareServiceId.InputReceivedHandlerContract]:
                CliMiddlewareServiceProvider.publishInputReceivedHandler,
            [CliMiddlewareServiceId.ThrowableCaughtHandlerContract]:
                CliMiddlewareServiceProvider.publishThrowableCaughtHandler,
            [CliMiddlewareServiceId.RouteMatchedHandlerContract]:
                CliMiddlewareServiceProvider.publishRouteMatchedHandler,
            [CliMiddlewareServiceId.RouteNotMatchedHandlerContract]:
                CliMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            [CliMiddlewareServiceId.RouteDispatchedHandlerContract]:
                CliMiddlewareServiceProvider.publishRouteDispatchedHandler,
            [CliMiddlewareServiceId.ExitedHandlerContract]: CliMiddlewareServiceProvider.publishExitedHandler,
        };
    }

    static publishInputReceivedHandler(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new InputReceivedHandler(container);

        container.setSingleton<InputReceivedHandlerContract>(
            CliMiddlewareServiceId.InputReceivedHandlerContract,
            handler,
        );

        handler.add(...config.inputReceivedMiddleware);
    }

    static publishRouteDispatchedHandler(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new RouteDispatchedHandler(container);

        container.setSingleton<RouteDispatchedHandlerContract>(
            CliMiddlewareServiceId.RouteDispatchedHandlerContract,
            handler,
        );

        handler.add(...config.routeDispatchedMiddleware);
    }

    static publishThrowableCaughtHandler(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new ThrowableCaughtHandler(container);

        container.setSingleton<ThrowableCaughtHandlerContract>(
            CliMiddlewareServiceId.ThrowableCaughtHandlerContract,
            handler,
        );

        handler.add(...config.throwableCaughtMiddleware);
    }

    static publishRouteMatchedHandler(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new RouteMatchedHandler(container);

        container.setSingleton<RouteMatchedHandlerContract>(
            CliMiddlewareServiceId.RouteMatchedHandlerContract,
            handler,
        );

        handler.add(...config.routeMatchedMiddleware);
    }

    static publishRouteNotMatchedHandler(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new RouteNotMatchedHandler(container);

        container.setSingleton<RouteNotMatchedHandlerContract>(
            CliMiddlewareServiceId.RouteNotMatchedHandlerContract,
            handler,
        );

        handler.add(...config.routeNotMatchedMiddleware);
    }

    static publishExitedHandler(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new ExitedHandler(container);

        container.setSingleton<ExitedHandlerContract>(CliMiddlewareServiceId.ExitedHandlerContract, handler);

        handler.add(...config.exitedMiddleware);
    }
}
