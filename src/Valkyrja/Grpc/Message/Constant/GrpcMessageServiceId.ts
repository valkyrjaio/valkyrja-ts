/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class GrpcMessageServiceId {
    static readonly ServiceCallContract = 'Valkyrja.Grpc.Message.Call.ServiceCallContract' as const;
    static readonly ServiceResponseContract = 'Valkyrja.Grpc.Message.Response.ServiceResponseContract' as const;
}
