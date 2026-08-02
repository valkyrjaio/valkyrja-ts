/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { CliMiddlewareServiceId } from '../../../../../../src/Valkyrja/Cli/Middleware/Constant/CliMiddlewareServiceId.ts';
import { ProcessExitingHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/ProcessExitingHandler.ts';
import { InputReceivedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/InputReceivedHandler.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteNotMatchedHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/ThrowableCaughtHandler.ts';
import { CliMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareServiceProvider.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

function containerWithConfig(): Container {
    const container = new Container();
    container.setSingleton(ApplicationServiceId.CliConfigContract, {
        inputReceivedMiddleware: [],
        routeDispatchedMiddleware: [],
        throwableCaughtMiddleware: [],
        routeMatchedMiddleware: [],
        routeNotMatchedMiddleware: [],
        processExitingMiddleware: [],
    });

    return container;
}

describe('CliMiddlewareServiceProvider', () => {
    it('publishes all six middleware handler ids', () => {
        const publishers = new CliMiddlewareServiceProvider().publishers();

        expect(Object.keys(publishers)).toHaveLength(6);
    });

    it.each([
        [
            CliMiddlewareServiceProvider.publishInputReceivedHandler,
            CliMiddlewareServiceId.InputReceivedHandlerContract,
            InputReceivedHandler,
        ],
        [
            CliMiddlewareServiceProvider.publishRouteDispatchedHandler,
            CliMiddlewareServiceId.RouteDispatchedHandlerContract,
            RouteDispatchedHandler,
        ],
        [
            CliMiddlewareServiceProvider.publishThrowableCaughtHandler,
            CliMiddlewareServiceId.ThrowableCaughtHandlerContract,
            ThrowableCaughtHandler,
        ],
        [
            CliMiddlewareServiceProvider.publishRouteMatchedHandler,
            CliMiddlewareServiceId.RouteMatchedHandlerContract,
            RouteMatchedHandler,
        ],
        [
            CliMiddlewareServiceProvider.publishRouteNotMatchedHandler,
            CliMiddlewareServiceId.RouteNotMatchedHandlerContract,
            RouteNotMatchedHandler,
        ],
        [
            CliMiddlewareServiceProvider.publishProcessExitingHandler,
            CliMiddlewareServiceId.ProcessExitingHandlerContract,
            ProcessExitingHandler,
        ],
    ])('registers a handler singleton', (publish, id, HandlerClass) => {
        const container = containerWithConfig();

        publish(container);

        expect(container.getSingleton(id)).toBeInstanceOf(HandlerClass);
    });
});
