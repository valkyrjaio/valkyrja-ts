import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.js';
import { CliInteractionServiceId } from '../../../Cli/Interaction/Constant/CliInteractionServiceId.js';
import { Route } from '../../../Cli/Routing/Data/Route.js';
import { HttpRoutingServiceId } from '../Constant/HttpRoutingServiceId.js';
import { ListCommand } from '../Cli/Command/ListCommand.js';
import { HttpCommandName } from '../Cli/Command/Constant/CommandName.js';

import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.js';
import type { OutputContract } from '../../../Cli/Interaction/Output/Contract/OutputContract.js';
import type { OutputFactoryContract } from '../../../Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import type { RouteContract } from '../../../Cli/Routing/Data/Contract/RouteContract.js';
import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.js';

export class HttpRoutingCliRouteProvider implements CliRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [
            new Route(HttpCommandName.LIST, 'List all routes', HttpRoutingCliRouteProvider.listHandler, () =>
                ListCommand.help(),
            ),
        ];
    }

    static listHandler(this: void, container: ContainerContract, cliRoute: RouteContract): OutputContract {
        return new ListCommand(
            container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract),
            cliRoute,
            container.getSingleton<RouteCollectionContract>(HttpRoutingServiceId.RouteCollectionContract),
            container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
        ).run();
    }
}
