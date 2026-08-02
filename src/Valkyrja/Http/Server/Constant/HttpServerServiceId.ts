/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class HttpServerServiceId {
    static readonly RequestHandlerContract = 'Valkyrja.Http.Server.Handler.RequestHandlerContract' as const;
    static readonly ExceptionResponseHandlerContract =
        'Valkyrja.Http.Server.Handler.ExceptionResponseRequestHandlerContract' as const;
}
