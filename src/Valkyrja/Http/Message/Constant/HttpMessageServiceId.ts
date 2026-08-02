/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class HttpMessageServiceId {
    static readonly ServerRequestContract = 'Valkyrja.Http.Message.Request.ServerRequestContract' as const;
    static readonly ResponseFactoryContract = 'Valkyrja.Http.Message.Response.Factory.ResponseFactoryContract' as const;
}
