import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.js';
import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.js';
import type { ConfigContract } from '../../../Application/Data/Contract/ConfigContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import { CliInteractionServiceId } from '../../Interaction/Constant/CliInteractionServiceId.js';
import type { CliInteractionConfigContract } from '../../Interaction/Data/Contract/CliInteractionConfigContract.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import { CliMiddlewareServiceId } from '../../Middleware/Constant/CliMiddlewareServiceId.js';
import type { ExitedHandlerContract } from '../../Middleware/Handler/Contract/ExitedHandlerContract.js';
import type { InputReceivedHandlerContract } from '../../Middleware/Handler/Contract/InputReceivedHandlerContract.js';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import type { RouteCollectionContract } from '../../Routing/Collection/Contract/RouteCollectionContract.js';
import { CliRoutingServiceId } from '../../Routing/Constant/CliRoutingServiceId.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.js';
import { OptionName } from '../../Routing/Constant/OptionName.js';
import { OptionShortName } from '../../Routing/Constant/OptionShortName.js';
import { HelpCommand } from '../Command/HelpCommand.js';
import { ListBashCommand } from '../Command/ListBashCommand.js';
import { ListCommand } from '../Command/ListCommand.js';
import { VersionCommand } from '../Command/VersionCommand.js';
import { CliServerServiceId } from '../Constant/CliServerServiceId.js';
import type { CliHelpCommandConfigContract } from '../Data/Contract/CliHelpCommandConfigContract.js';
import type { CliNoInteractionConfigContract } from '../Data/Contract/CliNoInteractionConfigContract.js';
import type { CliQuietInteractionConfigContract } from '../Data/Contract/CliQuietInteractionConfigContract.js';
import type { CliSilentInteractionConfigContract } from '../Data/Contract/CliSilentInteractionConfigContract.js';
import type { CliVersionCommandConfigContract } from '../Data/Contract/CliVersionCommandConfigContract.js';
import type { InputHandlerContract } from '../Handler/Contract/InputHandlerContract.js';
import { InputHandler } from '../Handler/InputHandler.js';
import { CheckCommandForTypoMiddleware } from '../Middleware/RouteNotMatched/CheckCommandForTypoMiddleware.js';
import { CheckForHelpOptionsMiddleware } from '../Middleware/InputReceived/CheckForHelpOptionsMiddleware.js';
import { CheckForVersionOptionsMiddleware } from '../Middleware/InputReceived/CheckForVersionOptionsMiddleware.js';
import { CheckGlobalInteractionOptionsMiddleware } from '../Middleware/InputReceived/CheckGlobalInteractionOptionsMiddleware.js';
import { LogThrowableCaughtMiddleware } from '../Middleware/ThrowableCaught/LogThrowableCaughtMiddleware.js';
import { OutputThrowableCaughtMiddleware } from '../Middleware/ThrowableCaught/OutputThrowableCaughtMiddleware.js';
import { CliCommandName } from '../Constant/CommandName.js';
import { LoggerContractId } from '../../../Log/Logger/Contract/LoggerContract.js';
import type { LoggerContract } from '../../../Log/Logger/Contract/LoggerContract.js';

export class CliServerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliServerServiceId.InputHandlerContract]:                    CliServerServiceProvider.publishInputHandler,
            [CliServerServiceId.HelpCommand]:                             CliServerServiceProvider.publishHelpCommand,
            [CliServerServiceId.ListBashCommand]:                         CliServerServiceProvider.publishListBashCommand,
            [CliServerServiceId.ListCommand]:                             CliServerServiceProvider.publishListCommand,
            [CliServerServiceId.VersionCommand]:                          CliServerServiceProvider.publishVersionCommand,
            [CliServerServiceId.LogThrowableCaughtMiddleware]:            CliServerServiceProvider.publishLogThrowableCaughtMiddleware,
            [CliServerServiceId.OutputThrowableCaughtMiddleware]:         CliServerServiceProvider.publishOutputThrowableCaughtMiddleware,
            [CliServerServiceId.CheckForHelpOptionsMiddleware]:           CliServerServiceProvider.publishCheckForHelpOptionsMiddleware,
            [CliServerServiceId.CheckForVersionOptionsMiddleware]:        CliServerServiceProvider.publishCheckForVersionOptionsMiddleware,
            [CliServerServiceId.CheckGlobalInteractionOptionsMiddleware]: CliServerServiceProvider.publishCheckGlobalInteractionOptionsMiddleware,
            [CliServerServiceId.CheckCommandForTypoMiddleware]:           CliServerServiceProvider.publishCheckCommandForTypoMiddleware,
        };
    }

    static publishInputHandler(container: ContainerContract): void {
        container.setSingleton<InputHandlerContract>(
            CliServerServiceId.InputHandlerContract,
            new InputHandler(
                container,
                container.getSingleton<RouterContract>(CliRoutingServiceId.RouterContract),
                container.getSingleton<InputReceivedHandlerContract>(CliMiddlewareServiceId.InputReceivedHandlerContract),
                container.getSingleton<ThrowableCaughtHandlerContract>(CliMiddlewareServiceId.ThrowableCaughtHandlerContract),
                container.getSingleton<ExitedHandlerContract>(CliMiddlewareServiceId.ExitedHandlerContract),
                container.getSingleton<CliInteractionConfigContract>(CliInteractionServiceId.CliInteractionConfigContract),
            ),
        );
    }

    static publishHelpCommand(container: ContainerContract): void {
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

    static publishListBashCommand(container: ContainerContract): void {
        container.setSingleton<ListBashCommand>(
            CliServerServiceId.ListBashCommand,
            new ListBashCommand(
                container.getSingleton<RouteContract>(CliRoutingServiceId.RouteContract),
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
            ),
        );
    }

    static publishListCommand(container: ContainerContract): void {
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

    static publishVersionCommand(container: ContainerContract): void {
        container.setSingleton<VersionCommand>(
            CliServerServiceId.VersionCommand,
            new VersionCommand(
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
                container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract),
                container.getSingleton<RouteContract>(CliRoutingServiceId.RouteContract),
            ),
        );
    }

    static publishLogThrowableCaughtMiddleware(container: ContainerContract): void {
        container.setSingleton<LogThrowableCaughtMiddleware>(
            CliServerServiceId.LogThrowableCaughtMiddleware,
            new LogThrowableCaughtMiddleware(
                container.getSingleton<LoggerContract>(LoggerContractId),
            ),
        );
    }

    static publishOutputThrowableCaughtMiddleware(container: ContainerContract): void {
        container.setSingleton<OutputThrowableCaughtMiddleware>(
            CliServerServiceId.OutputThrowableCaughtMiddleware,
            new OutputThrowableCaughtMiddleware(),
        );
    }

    static publishCheckForHelpOptionsMiddleware(container: ContainerContract): void {
        const config     = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);
        let commandName: string  = CliCommandName.HELP;
        let name: string         = OptionName.HELP;
        let shortName: string    = OptionShortName.HELP;

        if (CliServerServiceProvider.isHelpCommandConfig(config)) {
            commandName = config.helpCommandName;
            name        = config.helpOptionName;
            shortName   = config.helpOptionShortName;
        }

        container.setSingleton<CheckForHelpOptionsMiddleware>(
            CliServerServiceId.CheckForHelpOptionsMiddleware,
            new CheckForHelpOptionsMiddleware(commandName, name, shortName),
        );
    }

    static publishCheckForVersionOptionsMiddleware(container: ContainerContract): void {
        const config     = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);
        let commandName: string  = CliCommandName.VERSION;
        let name: string         = OptionName.VERSION;
        let shortName: string    = OptionShortName.VERSION;

        if (CliServerServiceProvider.isVersionCommandConfig(config)) {
            commandName = config.versionCommandName;
            name        = config.versionOptionName;
            shortName   = config.versionOptionShortName;
        }

        container.setSingleton<CheckForVersionOptionsMiddleware>(
            CliServerServiceId.CheckForVersionOptionsMiddleware,
            new CheckForVersionOptionsMiddleware(commandName, name, shortName),
        );
    }

    static publishCheckGlobalInteractionOptionsMiddleware(container: ContainerContract): void {
        const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);

        let noInteractionOptionName: string      = OptionName.NO_INTERACTION;
        let noInteractionOptionShortName: string = OptionShortName.NO_INTERACTION;
        let quietOptionName: string              = OptionName.QUIET;
        let quietOptionShortName: string         = OptionShortName.QUIET;
        let silentOptionName: string             = OptionName.SILENT;
        let silentOptionShortName: string        = OptionShortName.SILENT;

        if (CliServerServiceProvider.isNoInteractionConfig(config)) {
            noInteractionOptionName      = config.noInteractionOptionName;
            noInteractionOptionShortName = config.noInteractionOptionShortName;
        }

        if (CliServerServiceProvider.isQuietConfig(config)) {
            quietOptionName      = config.quietOptionName;
            quietOptionShortName = config.quietOptionShortName;
        }

        if (CliServerServiceProvider.isSilentConfig(config)) {
            silentOptionName      = config.silentOptionName;
            silentOptionShortName = config.silentOptionShortName;
        }

        container.setSingleton<CheckGlobalInteractionOptionsMiddleware>(
            CliServerServiceId.CheckGlobalInteractionOptionsMiddleware,
            new CheckGlobalInteractionOptionsMiddleware(
                container.getSingleton<CliInteractionConfigContract>(CliInteractionServiceId.CliInteractionConfigContract),
                noInteractionOptionName,
                noInteractionOptionShortName,
                quietOptionName,
                quietOptionShortName,
                silentOptionName,
                silentOptionShortName,
            ),
        );
    }

    static publishCheckCommandForTypoMiddleware(container: ContainerContract): void {
        container.setSingleton<CheckCommandForTypoMiddleware>(
            CliServerServiceId.CheckCommandForTypoMiddleware,
            new CheckCommandForTypoMiddleware(
                container.getSingleton<RouterContract>(CliRoutingServiceId.RouterContract),
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
            ),
        );
    }

    protected static isHelpCommandConfig(config: ConfigContract): config is ConfigContract & CliHelpCommandConfigContract {
        return 'helpCommandName' in config;
    }

    protected static isVersionCommandConfig(config: ConfigContract): config is ConfigContract & CliVersionCommandConfigContract {
        return 'versionCommandName' in config;
    }

    protected static isNoInteractionConfig(config: ConfigContract): config is ConfigContract & CliNoInteractionConfigContract {
        return 'noInteractionOptionName' in config;
    }

    protected static isQuietConfig(config: ConfigContract): config is ConfigContract & CliQuietInteractionConfigContract {
        return 'quietOptionName' in config;
    }

    protected static isSilentConfig(config: ConfigContract): config is ConfigContract & CliSilentInteractionConfigContract {
        return 'silentOptionName' in config;
    }
}
