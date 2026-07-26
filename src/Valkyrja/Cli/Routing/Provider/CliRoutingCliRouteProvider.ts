/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { CliRouteProviderContract } from './Contract/CliRouteProviderContract.ts';
import type { HelpCommand } from '../../Server/Command/HelpCommand.ts';
import type { ListBashCommand } from '../../Server/Command/ListBashCommand.ts';
import type { ListCommand } from '../../Server/Command/ListCommand.ts';
import type { VersionCommand } from '../../Server/Command/VersionCommand.ts';
import { Message } from '../../Interaction/Message/Message.ts';
import { OptionParameter } from '../Data/OptionParameter.ts';
import { ArgumentParameter } from '../Data/ArgumentParameter.ts';
import { Route } from '../Data/Route.ts';
import { CliServerServiceId } from '../../Server/Constant/CliServerServiceId.ts';
import { CliCommandName } from '../../Server/Constant/CommandName.ts';

export class CliRoutingCliRouteProvider implements CliRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        return [];
    }

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

    static listHandler(this: void, container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<ListCommand>(CliServerServiceId.ListCommand).run();
    }

    static listBashHandler(this: void, container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<ListBashCommand>(CliServerServiceId.ListBashCommand).run();
    }

    static helpHandler(this: void, container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<HelpCommand>(CliServerServiceId.HelpCommand).run();
    }

    static versionHandler(this: void, container: ContainerContract, _route: RouteContract): OutputContract {
        return container.getSingleton<VersionCommand>(CliServerServiceId.VersionCommand).run();
    }
}
