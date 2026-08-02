/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.ts';
import type { ConfigContract } from '../../../Application/Data/Contract/ConfigContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import { CliInteractionServiceId } from '../../Interaction/Constant/CliInteractionServiceId.ts';
import type { CliInteractionConfigContract } from '../../Interaction/Data/Contract/CliInteractionConfigContract.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import { CliMiddlewareServiceId } from '../../Middleware/Constant/CliMiddlewareServiceId.ts';
import type { ProcessExitingHandlerContract } from '../../Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import type { InputReceivedHandlerContract } from '../../Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouteCollectionContract } from '../../Routing/Collection/Contract/RouteCollectionContract.ts';
import { CliRoutingServiceId } from '../../Routing/Constant/CliRoutingServiceId.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.ts';
import { OptionName } from '../../Routing/Constant/OptionName.ts';
import { OptionShortName } from '../../Routing/Constant/OptionShortName.ts';
import { HelpCommand } from '../Command/HelpCommand.ts';
import { ListBashCommand } from '../Command/ListBashCommand.ts';
import { ListCommand } from '../Command/ListCommand.ts';
import { VersionCommand } from '../Command/VersionCommand.ts';
import { CliServerServiceId } from '../Constant/CliServerServiceId.ts';
import type { CliHelpCommandConfigContract } from '../Data/Contract/CliHelpCommandConfigContract.ts';
import type { CliNoInteractionConfigContract } from '../Data/Contract/CliNoInteractionConfigContract.ts';
import type { CliQuietInteractionConfigContract } from '../Data/Contract/CliQuietInteractionConfigContract.ts';
import type { CliSilentInteractionConfigContract } from '../Data/Contract/CliSilentInteractionConfigContract.ts';
import type { CliVersionCommandConfigContract } from '../Data/Contract/CliVersionCommandConfigContract.ts';
import type { InputHandlerContract } from '../Handler/Contract/InputHandlerContract.ts';
import { InputHandler } from '../Handler/InputHandler.ts';
import { CheckCommandForTypoMiddleware } from '../Middleware/RouteNotMatched/CheckCommandForTypoMiddleware.ts';
import { CheckForHelpOptionsMiddleware } from '../Middleware/InputReceived/CheckForHelpOptionsMiddleware.ts';
import { CheckForVersionOptionsMiddleware } from '../Middleware/InputReceived/CheckForVersionOptionsMiddleware.ts';
import { CheckGlobalInteractionOptionsMiddleware } from '../Middleware/InputReceived/CheckGlobalInteractionOptionsMiddleware.ts';
import { LogThrowableCaughtMiddleware } from '../Middleware/ThrowableCaught/LogThrowableCaughtMiddleware.ts';
import { OutputThrowableCaughtMiddleware } from '../Middleware/ThrowableCaught/OutputThrowableCaughtMiddleware.ts';
import { CliCommandName } from '../Constant/CommandName.ts';
import { LoggerContractId } from '../../../Log/Logger/Contract/LoggerContract.ts';
import type { LoggerContract } from '../../../Log/Logger/Contract/LoggerContract.ts';

export class CliServerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliServerServiceId.InputHandlerContract]: CliServerServiceProvider.publishInputHandler,
            [CliServerServiceId.HelpCommand]: CliServerServiceProvider.publishHelpCommand,
            [CliServerServiceId.ListBashCommand]: CliServerServiceProvider.publishListBashCommand,
            [CliServerServiceId.ListCommand]: CliServerServiceProvider.publishListCommand,
            [CliServerServiceId.VersionCommand]: CliServerServiceProvider.publishVersionCommand,
            [CliServerServiceId.LogThrowableCaughtMiddleware]:
                CliServerServiceProvider.publishLogThrowableCaughtMiddleware,
            [CliServerServiceId.OutputThrowableCaughtMiddleware]:
                CliServerServiceProvider.publishOutputThrowableCaughtMiddleware,
            [CliServerServiceId.CheckForHelpOptionsMiddleware]:
                CliServerServiceProvider.publishCheckForHelpOptionsMiddleware,
            [CliServerServiceId.CheckForVersionOptionsMiddleware]:
                CliServerServiceProvider.publishCheckForVersionOptionsMiddleware,
            [CliServerServiceId.CheckGlobalInteractionOptionsMiddleware]:
                CliServerServiceProvider.publishCheckGlobalInteractionOptionsMiddleware,
            [CliServerServiceId.CheckCommandForTypoMiddleware]:
                CliServerServiceProvider.publishCheckCommandForTypoMiddleware,
        };
    }

    static publishInputHandler(this: void, container: ContainerContract): void {
        container.setSingleton<InputHandlerContract>(
            CliServerServiceId.InputHandlerContract,
            new InputHandler(
                container,
                container.getSingleton<RouterContract>(CliRoutingServiceId.RouterContract),
                container.getSingleton<InputReceivedHandlerContract>(
                    CliMiddlewareServiceId.InputReceivedHandlerContract,
                ),
                container.getSingleton<ThrowableCaughtHandlerContract>(
                    CliMiddlewareServiceId.ThrowableCaughtHandlerContract,
                ),
                container.getSingleton<ProcessExitingHandlerContract>(
                    CliMiddlewareServiceId.ProcessExitingHandlerContract,
                ),
                container.getSingleton<CliInteractionConfigContract>(
                    CliInteractionServiceId.CliInteractionConfigContract,
                ),
            ),
        );
    }

    static publishHelpCommand(this: void, container: ContainerContract): void {
        container.setSingleton<HelpCommand>(
            CliServerServiceId.HelpCommand,
            new HelpCommand(
                container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract),
                container.getSingleton<RouteContract>(CliRoutingServiceId.RouteContract),
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
            ),
        );
    }

    static publishListBashCommand(this: void, container: ContainerContract): void {
        container.setSingleton<ListBashCommand>(
            CliServerServiceId.ListBashCommand,
            new ListBashCommand(
                container.getSingleton<RouteContract>(CliRoutingServiceId.RouteContract),
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
            ),
        );
    }

    static publishListCommand(this: void, container: ContainerContract): void {
        container.setSingleton<ListCommand>(
            CliServerServiceId.ListCommand,
            new ListCommand(
                container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract),
                container.getSingleton<RouteContract>(CliRoutingServiceId.RouteContract),
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
            ),
        );
    }

    static publishVersionCommand(this: void, container: ContainerContract): void {
        container.setSingleton<VersionCommand>(
            CliServerServiceId.VersionCommand,
            new VersionCommand(
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
                container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract),
                container.getSingleton<RouteContract>(CliRoutingServiceId.RouteContract),
            ),
        );
    }

    static publishLogThrowableCaughtMiddleware(this: void, container: ContainerContract): void {
        container.setSingleton<LogThrowableCaughtMiddleware>(
            CliServerServiceId.LogThrowableCaughtMiddleware,
            new LogThrowableCaughtMiddleware(container.getSingleton<LoggerContract>(LoggerContractId)),
        );
    }

    static publishOutputThrowableCaughtMiddleware(this: void, container: ContainerContract): void {
        container.setSingleton<OutputThrowableCaughtMiddleware>(
            CliServerServiceId.OutputThrowableCaughtMiddleware,
            new OutputThrowableCaughtMiddleware(),
        );
    }

    static publishCheckForHelpOptionsMiddleware(this: void, container: ContainerContract): void {
        const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);
        let commandName: string = CliCommandName.HELP;
        let name: string = OptionName.HELP;
        let shortName: string = OptionShortName.HELP;

        if (CliServerServiceProvider.isHelpCommandConfig(config)) {
            commandName = config.helpCommandName;
            name = config.helpOptionName;
            shortName = config.helpOptionShortName;
        }

        container.setSingleton<CheckForHelpOptionsMiddleware>(
            CliServerServiceId.CheckForHelpOptionsMiddleware,
            new CheckForHelpOptionsMiddleware(commandName, name, shortName),
        );
    }

    static publishCheckForVersionOptionsMiddleware(this: void, container: ContainerContract): void {
        const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);
        let commandName: string = CliCommandName.VERSION;
        let name: string = OptionName.VERSION;
        let shortName: string = OptionShortName.VERSION;

        if (CliServerServiceProvider.isVersionCommandConfig(config)) {
            commandName = config.versionCommandName;
            name = config.versionOptionName;
            shortName = config.versionOptionShortName;
        }

        container.setSingleton<CheckForVersionOptionsMiddleware>(
            CliServerServiceId.CheckForVersionOptionsMiddleware,
            new CheckForVersionOptionsMiddleware(commandName, name, shortName),
        );
    }

    static publishCheckGlobalInteractionOptionsMiddleware(this: void, container: ContainerContract): void {
        const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);

        let noInteractionOptionName: string = OptionName.NO_INTERACTION;
        let noInteractionOptionShortName: string = OptionShortName.NO_INTERACTION;
        let quietOptionName: string = OptionName.QUIET;
        let quietOptionShortName: string = OptionShortName.QUIET;
        let silentOptionName: string = OptionName.SILENT;
        let silentOptionShortName: string = OptionShortName.SILENT;

        if (CliServerServiceProvider.isNoInteractionConfig(config)) {
            noInteractionOptionName = config.noInteractionOptionName;
            noInteractionOptionShortName = config.noInteractionOptionShortName;
        }

        if (CliServerServiceProvider.isQuietConfig(config)) {
            quietOptionName = config.quietOptionName;
            quietOptionShortName = config.quietOptionShortName;
        }

        if (CliServerServiceProvider.isSilentConfig(config)) {
            silentOptionName = config.silentOptionName;
            silentOptionShortName = config.silentOptionShortName;
        }

        container.setSingleton<CheckGlobalInteractionOptionsMiddleware>(
            CliServerServiceId.CheckGlobalInteractionOptionsMiddleware,
            new CheckGlobalInteractionOptionsMiddleware(
                container.getSingleton<CliInteractionConfigContract>(
                    CliInteractionServiceId.CliInteractionConfigContract,
                ),
                noInteractionOptionName,
                noInteractionOptionShortName,
                quietOptionName,
                quietOptionShortName,
                silentOptionName,
                silentOptionShortName,
            ),
        );
    }

    static publishCheckCommandForTypoMiddleware(this: void, container: ContainerContract): void {
        container.setSingleton<CheckCommandForTypoMiddleware>(
            CliServerServiceId.CheckCommandForTypoMiddleware,
            new CheckCommandForTypoMiddleware(
                container.getSingleton<RouterContract>(CliRoutingServiceId.RouterContract),
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
            ),
        );
    }

    protected static isHelpCommandConfig(
        config: ConfigContract,
    ): config is ConfigContract & CliHelpCommandConfigContract {
        return 'helpCommandName' in config;
    }

    protected static isVersionCommandConfig(
        config: ConfigContract,
    ): config is ConfigContract & CliVersionCommandConfigContract {
        return 'versionCommandName' in config;
    }

    protected static isNoInteractionConfig(
        config: ConfigContract,
    ): config is ConfigContract & CliNoInteractionConfigContract {
        return 'noInteractionOptionName' in config;
    }

    protected static isQuietConfig(
        config: ConfigContract,
    ): config is ConfigContract & CliQuietInteractionConfigContract {
        return 'quietOptionName' in config;
    }

    protected static isSilentConfig(
        config: ConfigContract,
    ): config is ConfigContract & CliSilentInteractionConfigContract {
        return 'silentOptionName' in config;
    }
}
