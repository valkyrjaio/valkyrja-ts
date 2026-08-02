/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class CliRoutingServiceId {
    static readonly RouterContract = 'Valkyrja.Cli.Routing.Dispatcher.RouterContract' as const;
    static readonly RouteCollectionContract = 'Valkyrja.Cli.Routing.Collection.RouteCollectionContract' as const;
    static readonly RouteCollectorContract = 'Valkyrja.Cli.Routing.Collector.RouteCollectorContract' as const;
    static readonly RouteContract = 'Valkyrja.Cli.Routing.Data.RouteContract' as const;
    static readonly CliRoutingData = 'Valkyrja.Cli.Routing.Data.CliRoutingData' as const;
    static readonly CliRoutingConfig = 'Valkyrja.Cli.Routing.Data.CliRoutingConfig' as const;
}
