/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { CliConfig } from '../../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionServiceId } from '../../../../../../src/Valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { HttpRoutingServiceId } from '../../../../../../src/Valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';
import { HttpCommandName } from '../../../../../../src/Valkyrja/Http/Routing/Cli/Command/Constant/CommandName.ts';
import { HttpRoutingCliRouteProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliRouteProvider.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { RouteContract } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

describe('HttpRoutingCliRouteProvider', () => {
    it('declares no decorator controller classes', () => {
        expect(new HttpRoutingCliRouteProvider().getControllerClasses()).toStrictEqual([]);
    });

    it('provides the routes:list command with help text', () => {
        const routes = new HttpRoutingCliRouteProvider().getRoutes();

        expect(routes.map((r) => r.getName())).toContain(HttpCommandName.LIST);
        expect(routes[0]?.getHelpTextMessage().getText()).not.toBe('');
    });

    it('listHandler resolves and runs the list command', () => {
        const container = new Container();
        container.setSingleton(ApplicationServiceId.CliConfigContract, new CliConfig());
        container.setSingleton(HttpRoutingServiceId.RouteCollectionContract, new RouteCollection());
        container.setSingleton(
            CliInteractionServiceId.OutputFactoryContract,
            new OutputFactory(new CliInteractionConfig()),
        );

        const route = {} as unknown as RouteContract;
        const output = HttpRoutingCliRouteProvider.listHandler(container, route);

        expect(output.getExitCode()).toBeDefined();
    });
});
