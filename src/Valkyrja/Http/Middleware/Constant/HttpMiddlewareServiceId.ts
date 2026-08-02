/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class HttpMiddlewareServiceId {
    static readonly RequestReceivedHandlerContract =
        'Valkyrja.Http.Middleware.Handler.RequestReceivedHandlerContract' as const;
    static readonly ThrowableCaughtHandlerContract =
        'Valkyrja.Http.Middleware.Handler.ThrowableCaughtHandlerContract' as const;
    static readonly RouteMatchedHandlerContract =
        'Valkyrja.Http.Middleware.Handler.RouteMatchedHandlerContract' as const;
    static readonly RouteNotMatchedHandlerContract =
        'Valkyrja.Http.Middleware.Handler.RouteNotMatchedHandlerContract' as const;
    static readonly RouteDispatchedHandlerContract =
        'Valkyrja.Http.Middleware.Handler.RouteDispatchedHandlerContract' as const;
    static readonly SendingResponseHandlerContract =
        'Valkyrja.Http.Middleware.Handler.SendingResponseHandlerContract' as const;
    static readonly ResponseSentHandlerContract =
        'Valkyrja.Http.Middleware.Handler.ResponseSentHandlerContract' as const;
}
