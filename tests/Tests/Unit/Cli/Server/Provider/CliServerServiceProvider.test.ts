/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { CliConfig } from '../../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionServiceId } from '../../../../../../src/Valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { CliMiddlewareServiceId } from '../../../../../../src/Valkyrja/Cli/Middleware/Constant/CliMiddlewareServiceId.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { CliRoutingServiceId } from '../../../../../../src/Valkyrja/Cli/Routing/Constant/CliRoutingServiceId.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { HelpCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/HelpCommand.ts';
import { ListBashCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/ListBashCommand.ts';
import { ListCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/ListCommand.ts';
import { VersionCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/VersionCommand.ts';
import { CliServerServiceId } from '../../../../../../src/Valkyrja/Cli/Server/Constant/CliServerServiceId.ts';
import { InputHandler } from '../../../../../../src/Valkyrja/Cli/Server/Handler/InputHandler.ts';
import { CheckForHelpOptionsMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckForHelpOptionsMiddleware.ts';
import { CheckForVersionOptionsMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckForVersionOptionsMiddleware.ts';
import { CheckGlobalInteractionOptionsMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckGlobalInteractionOptionsMiddleware.ts';
import { CheckCommandForTypoMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/RouteNotMatched/CheckCommandForTypoMiddleware.ts';
import { LogThrowableCaughtMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/ThrowableCaught/LogThrowableCaughtMiddleware.ts';
import { OutputThrowableCaughtMiddleware } from '../../../../../../src/Valkyrja/Cli/Server/Middleware/ThrowableCaught/OutputThrowableCaughtMiddleware.ts';
import { CliServerServiceProvider } from '../../../../../../src/Valkyrja/Cli/Server/Provider/CliServerServiceProvider.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { LoggerContractId } from '../../../../../../src/Valkyrja/Log/Logger/Contract/LoggerContract.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();

function fullContainer(config: object = { namespace: 'App' }): Container {
    const container = new Container();
    container.setSingleton(ApplicationServiceId.ConfigContract, config);
    container.setSingleton(ApplicationServiceId.CliConfigContract, new CliConfig());
    container.setSingleton(CliRoutingServiceId.RouterContract, {});
    container.setSingleton(CliRoutingServiceId.RouteContract, new Route('build', 'd', handler));
    container.setSingleton(CliRoutingServiceId.RouteCollectionContract, new RouteCollection());
    container.setSingleton(CliInteractionServiceId.OutputFactoryContract, new OutputFactory());
    container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, new CliInteractionConfig());
    container.setSingleton(CliMiddlewareServiceId.InputReceivedHandlerContract, {});
    container.setSingleton(CliMiddlewareServiceId.ThrowableCaughtHandlerContract, {});
    container.setSingleton(CliMiddlewareServiceId.ExitedHandlerContract, {});
    container.setSingleton(LoggerContractId, { throwable: () => {} });

    return container;
}

describe('CliServerServiceProvider', () => {
    it('publishes all eleven server ids', () => {
        expect(Object.keys(new CliServerServiceProvider().publishers())).toHaveLength(11);
    });

    it.each([
        [CliServerServiceProvider.publishInputHandler, CliServerServiceId.InputHandlerContract, InputHandler],
        [CliServerServiceProvider.publishHelpCommand, CliServerServiceId.HelpCommand, HelpCommand],
        [CliServerServiceProvider.publishListBashCommand, CliServerServiceId.ListBashCommand, ListBashCommand],
        [CliServerServiceProvider.publishListCommand, CliServerServiceId.ListCommand, ListCommand],
        [CliServerServiceProvider.publishVersionCommand, CliServerServiceId.VersionCommand, VersionCommand],
        [
            CliServerServiceProvider.publishLogThrowableCaughtMiddleware,
            CliServerServiceId.LogThrowableCaughtMiddleware,
            LogThrowableCaughtMiddleware,
        ],
        [
            CliServerServiceProvider.publishOutputThrowableCaughtMiddleware,
            CliServerServiceId.OutputThrowableCaughtMiddleware,
            OutputThrowableCaughtMiddleware,
        ],
        [
            CliServerServiceProvider.publishCheckCommandForTypoMiddleware,
            CliServerServiceId.CheckCommandForTypoMiddleware,
            CheckCommandForTypoMiddleware,
        ],
    ])('registers a singleton', (publish, id, Expected) => {
        const container = fullContainer();

        publish(container);

        expect(container.getSingleton(id)).toBeInstanceOf(Expected);
    });

    it('uses default option names when the config does not customize them', () => {
        const container = fullContainer();

        CliServerServiceProvider.publishCheckForHelpOptionsMiddleware(container);
        CliServerServiceProvider.publishCheckForVersionOptionsMiddleware(container);
        CliServerServiceProvider.publishCheckGlobalInteractionOptionsMiddleware(container);

        expect(container.getSingleton(CliServerServiceId.CheckForHelpOptionsMiddleware)).toBeInstanceOf(
            CheckForHelpOptionsMiddleware,
        );
        expect(container.getSingleton(CliServerServiceId.CheckForVersionOptionsMiddleware)).toBeInstanceOf(
            CheckForVersionOptionsMiddleware,
        );
        expect(container.getSingleton(CliServerServiceId.CheckGlobalInteractionOptionsMiddleware)).toBeInstanceOf(
            CheckGlobalInteractionOptionsMiddleware,
        );
    });

    it('reads custom option names from a rich config', () => {
        const container = fullContainer({
            namespace: 'App',
            helpCommandName: 'help',
            helpOptionName: 'help',
            helpOptionShortName: 'h',
            versionCommandName: 'version',
            versionOptionName: 'version',
            versionOptionShortName: 'v',
            noInteractionOptionName: 'no-interaction',
            noInteractionOptionShortName: 'N',
            quietOptionName: 'quiet',
            quietOptionShortName: 'q',
            silentOptionName: 'silent',
            silentOptionShortName: 's',
        });

        CliServerServiceProvider.publishCheckForHelpOptionsMiddleware(container);
        CliServerServiceProvider.publishCheckForVersionOptionsMiddleware(container);
        CliServerServiceProvider.publishCheckGlobalInteractionOptionsMiddleware(container);

        expect(container.getSingleton(CliServerServiceId.CheckForHelpOptionsMiddleware)).toBeInstanceOf(
            CheckForHelpOptionsMiddleware,
        );
        expect(container.getSingleton(CliServerServiceId.CheckForVersionOptionsMiddleware)).toBeInstanceOf(
            CheckForVersionOptionsMiddleware,
        );
        expect(container.getSingleton(CliServerServiceId.CheckGlobalInteractionOptionsMiddleware)).toBeInstanceOf(
            CheckGlobalInteractionOptionsMiddleware,
        );
    });
});
