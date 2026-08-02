/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class CliMiddlewareServiceId {
    static readonly InputReceivedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.InputReceivedHandlerContract' as const;
    static readonly RouteMatchedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.RouteMatchedHandlerContract' as const;
    static readonly RouteNotMatchedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.RouteNotMatchedHandlerContract' as const;
    static readonly RouteDispatchedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.RouteDispatchedHandlerContract' as const;
    static readonly ThrowableCaughtHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.ThrowableCaughtHandlerContract' as const;
    static readonly ProcessExitingHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.ProcessExitingHandlerContract' as const;
}
