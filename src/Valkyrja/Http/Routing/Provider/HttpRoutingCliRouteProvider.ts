/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import { CliInteractionServiceId } from '../../../Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { Route } from '../../../Cli/Routing/Data/Route.ts';
import { HttpRoutingServiceId } from '../Constant/HttpRoutingServiceId.ts';
import { ListCommand } from '../Cli/Command/ListCommand.ts';
import { HttpCommandName } from '../Cli/Command/Constant/CommandName.ts';

import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.ts';
import type { OutputContract } from '../../../Cli/Interaction/Output/Contract/OutputContract.ts';
import type { OutputFactoryContract } from '../../../Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { RouteContract } from '../../../Cli/Routing/Data/Contract/RouteContract.ts';
import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';

export class HttpRoutingCliRouteProvider implements CliRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        return [];
    }

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
