/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class GrpcMiddlewareServiceId {
    static readonly CallReceivedHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.CallReceivedHandlerContract' as const;
    static readonly RouteMatchedHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.RouteMatchedHandlerContract' as const;
    static readonly RouteNotMatchedHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.RouteNotMatchedHandlerContract' as const;
    static readonly RouteDispatchedHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.RouteDispatchedHandlerContract' as const;
    static readonly ThrowableCaughtHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.ThrowableCaughtHandlerContract' as const;
    static readonly SendingResponseHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.SendingResponseHandlerContract' as const;
    static readonly ResponseSentHandlerContract =
        'Valkyrja.Grpc.Middleware.Handler.ResponseSentHandlerContract' as const;
}
