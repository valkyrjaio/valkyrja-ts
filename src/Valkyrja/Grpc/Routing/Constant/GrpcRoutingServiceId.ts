/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class GrpcRoutingServiceId {
    static readonly RouterContract = 'Valkyrja.Grpc.Routing.Dispatcher.RouterContract' as const;
    static readonly RouteCollectionContract = 'Valkyrja.Grpc.Routing.Collection.RouteCollectionContract' as const;
    static readonly RouteCollectorContract = 'Valkyrja.Grpc.Routing.Collector.RouteCollectorContract' as const;
    static readonly RouteContract = 'Valkyrja.Grpc.Routing.Data.RouteContract' as const;
    static readonly GrpcRoutingData = 'Valkyrja.Grpc.Routing.Data.GrpcRoutingData' as const;
}
