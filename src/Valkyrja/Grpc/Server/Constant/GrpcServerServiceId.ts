/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class GrpcServerServiceId {
    static readonly ServiceHandlerContract = 'Valkyrja.Grpc.Server.Handler.ServiceHandlerContract' as const;
    static readonly ServiceAdapterContract = 'Valkyrja.Grpc.Server.Adapter.ServiceAdapterContract' as const;
}
