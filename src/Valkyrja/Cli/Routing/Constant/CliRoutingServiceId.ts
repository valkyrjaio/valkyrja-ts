/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class CliRoutingServiceId {
    static readonly RouterContract = 'Valkyrja.Cli.Routing.Dispatcher.RouterContract' as const;
    static readonly RouteCollectionContract = 'Valkyrja.Cli.Routing.Collection.RouteCollectionContract' as const;
    static readonly RouteCollectorContract = 'Valkyrja.Cli.Routing.Collector.RouteCollectorContract' as const;
    static readonly CasterContract = 'Valkyrja.Cli.Routing.Caster.CasterContract' as const;
    static readonly RouteContract = 'Valkyrja.Cli.Routing.Data.RouteContract' as const;
    static readonly CliRoutingData = 'Valkyrja.Cli.Routing.Data.CliRoutingData' as const;
    static readonly CliRoutingConfigContract = 'Valkyrja.Cli.Routing.Data.CliRoutingConfigContract' as const;
}
