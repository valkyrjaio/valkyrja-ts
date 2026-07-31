/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class GrpcRoutingServiceId {
    static readonly RouterContract = 'Valkyrja.Grpc.Routing.Dispatcher.RouterContract' as const;
    static readonly RouteCollectionContract = 'Valkyrja.Grpc.Routing.Collection.RouteCollectionContract' as const;
    static readonly RouteCollectorContract = 'Valkyrja.Grpc.Routing.Collector.RouteCollectorContract' as const;
    static readonly RouteContract = 'Valkyrja.Grpc.Routing.Data.RouteContract' as const;
    static readonly GrpcRoutingData = 'Valkyrja.Grpc.Routing.Data.GrpcRoutingData' as const;
}
