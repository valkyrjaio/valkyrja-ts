import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.js';
import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import { CliMiddlewareServiceId } from '../Constant/CliMiddlewareServiceId.js';
import type { ExitedHandlerContract } from '../Handler/Contract/ExitedHandlerContract.js';
import type { InputReceivedHandlerContract } from '../Handler/Contract/InputReceivedHandlerContract.js';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.js';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.js';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.js';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.js';
import { ExitedHandler } from '../Handler/ExitedHandler.js';
import { InputReceivedHandler } from '../Handler/InputReceivedHandler.js';
import { RouteDispatchedHandler } from '../Handler/RouteDispatchedHandler.js';
import { RouteMatchedHandler } from '../Handler/RouteMatchedHandler.js';
import { RouteNotMatchedHandler } from '../Handler/RouteNotMatchedHandler.js';
import { ThrowableCaughtHandler } from '../Handler/ThrowableCaughtHandler.js';

export class CliMiddlewareServiceProvider implements ServiceProviderContract {
    static publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliMiddlewareServiceId.InputReceivedHandlerContract]:   CliMiddlewareServiceProvider.publishInputReceivedHandler,
            [CliMiddlewareServiceId.ThrowableCaughtHandlerContract]: CliMiddlewareServiceProvider.publishThrowableCaughtHandler,
            [CliMiddlewareServiceId.RouteMatchedHandlerContract]:    CliMiddlewareServiceProvider.publishRouteMatchedHandler,
            [CliMiddlewareServiceId.RouteNotMatchedHandlerContract]: CliMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            [CliMiddlewareServiceId.RouteDispatchedHandlerContract]: CliMiddlewareServiceProvider.publishRouteDispatchedHandler,
            [CliMiddlewareServiceId.ExitedHandlerContract]:          CliMiddlewareServiceProvider.publishExitedHandler,
        };
    }

    static publishInputReceivedHandler(container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new InputReceivedHandler(container);

        container.setSingleton<InputReceivedHandlerContract>(CliMiddlewareServiceId.InputReceivedHandlerContract, handler);

        handler.add(...config.inputReceivedMiddleware);
    }

    static publishRouteDispatchedHandler(container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new RouteDispatchedHandler(container);

        container.setSingleton<RouteDispatchedHandlerContract>(CliMiddlewareServiceId.RouteDispatchedHandlerContract, handler);

        handler.add(...config.routeDispatchedMiddleware);
    }

    static publishThrowableCaughtHandler(container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new ThrowableCaughtHandler(container);

        container.setSingleton<ThrowableCaughtHandlerContract>(CliMiddlewareServiceId.ThrowableCaughtHandlerContract, handler);

        handler.add(...config.throwableCaughtMiddleware);
    }

    static publishRouteMatchedHandler(container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new RouteMatchedHandler(container);

        container.setSingleton<RouteMatchedHandlerContract>(CliMiddlewareServiceId.RouteMatchedHandlerContract, handler);

        handler.add(...config.routeMatchedMiddleware);
    }

    static publishRouteNotMatchedHandler(container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new RouteNotMatchedHandler(container);

        container.setSingleton<RouteNotMatchedHandlerContract>(CliMiddlewareServiceId.RouteNotMatchedHandlerContract, handler);

        handler.add(...config.routeNotMatchedMiddleware);
    }

    static publishExitedHandler(container: ContainerContract): void {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        const handler = new ExitedHandler(container);

        container.setSingleton<ExitedHandlerContract>(CliMiddlewareServiceId.ExitedHandlerContract, handler);

        handler.add(...config.exitedMiddleware);
    }
}
