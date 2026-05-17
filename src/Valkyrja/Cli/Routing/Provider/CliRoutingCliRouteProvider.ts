import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { RouteContract } from '../Data/Contract/RouteContract.js';
import type { CliRouteProviderContract } from './Contract/CliRouteProviderContract.js';
import type { HelpCommand } from '../../Server/Command/HelpCommand.js';
import type { ListBashCommand } from '../../Server/Command/ListBashCommand.js';
import type { ListCommand } from '../../Server/Command/ListCommand.js';
import type { VersionCommand } from '../../Server/Command/VersionCommand.js';
import { Message } from '../../Interaction/Message/Message.js';
import { OptionParameter } from '../Data/OptionParameter.js';
import { ArgumentParameter } from '../Data/ArgumentParameter.js';
import { Route } from '../Data/Route.js';
import { CliServerServiceId } from '../../Server/Constant/CliServerServiceId.js';
import { CliCommandName } from '../../Server/Constant/CommandName.js';

export class CliRoutingCliRouteProvider implements CliRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [
            new Route(
                CliCommandName.HELP,
                'Help for a command',
                CliRoutingCliRouteProvider.helpHandler,
                () => new Message('A command to get help for a specific command.'),
                [],
                [],
                [],
                [],
                [],
                [new OptionParameter('command', 'The name of the command to get help for', 'command')],
            ),
            new Route(
                CliCommandName.LIST,
                'List all commands',
                CliRoutingCliRouteProvider.listHandler,
                () => new Message('A command to list all the commands present within the Cli component.'),
                [],
                [],
                [],
                [],
                [],
                [
                    new OptionParameter(
                        'namespace',
                        'An optional namespace to filter commands by',
                        'namespace',
                        null,
                        '',
                        ['n'],
                    ),
                ],
            ),
            new Route(
                CliCommandName.LIST_BASH,
                'List all commands for bash completion',
                CliRoutingCliRouteProvider.listBashHandler,
                () =>
                    new Message(
                        'A command to list all the commands present within the Cli component for bash completion.',
                    ),
                [],
                [],
                [],
                [],
                [
                    new ArgumentParameter('applicationName', 'The application name'),
                    new ArgumentParameter('namespace', 'An optional namespace to filter commands by'),
                ],
            ),
            new Route(
                CliCommandName.VERSION,
                'Get the application version',
                CliRoutingCliRouteProvider.versionHandler,
                () => new Message('A command to show the application version and info.'),
                [],
                [],
                [],
                [],
                [],
                [
                    new OptionParameter('short', 'Output the version number only', '', null, '', ['s']),
                    new OptionParameter('plain', 'Output version info without the banner', '', null, '', ['p']),
                ],
            ),
        ];
    }

    static listHandler(container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<ListCommand>(CliServerServiceId.ListCommand).run();
    }

    static listBashHandler(container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<ListBashCommand>(CliServerServiceId.ListBashCommand).run();
    }

    static helpHandler(container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<HelpCommand>(CliServerServiceId.HelpCommand).run();
    }

    static versionHandler(container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<VersionCommand>(CliServerServiceId.VersionCommand).run();
    }
}
