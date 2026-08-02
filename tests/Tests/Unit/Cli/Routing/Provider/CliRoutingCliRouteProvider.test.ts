/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { CliRoutingCliRouteProvider } from '../../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingCliRouteProvider.ts';
import { CliServerServiceId } from '../../../../../../src/Valkyrja/Cli/Server/Constant/CliServerServiceId.ts';
import { CliCommandName } from '../../../../../../src/Valkyrja/Cli/Server/Constant/CommandName.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { RouteContract } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

const route = {} as unknown as RouteContract;

describe('CliRoutingCliRouteProvider', () => {
    it('declares no decorator controller classes', () => {
        expect(new CliRoutingCliRouteProvider().getControllerClasses()).toStrictEqual([]);
    });

    it('provides the help, list, list:bash, and version routes', () => {
        const names = new CliRoutingCliRouteProvider().getRoutes().map((r) => r.getName());

        expect(names).toContain(CliCommandName.HELP);
        expect(names).toContain(CliCommandName.LIST);
        expect(names).toContain(CliCommandName.LIST_BASH);
        expect(names).toContain(CliCommandName.VERSION);
    });

    it('provides help text for every route', () => {
        for (const r of new CliRoutingCliRouteProvider().getRoutes()) {
            expect(r.getHelpTextMessage().getText()).not.toBe('');
        }
    });

    it.each([
        ['listHandler', CliRoutingCliRouteProvider.listHandler, CliServerServiceId.ListCommand],
        ['listBashHandler', CliRoutingCliRouteProvider.listBashHandler, CliServerServiceId.ListBashCommand],
        ['helpHandler', CliRoutingCliRouteProvider.helpHandler, CliServerServiceId.HelpCommand],
        ['versionHandler', CliRoutingCliRouteProvider.versionHandler, CliServerServiceId.VersionCommand],
    ])('%s resolves and runs its command', (_name, handler, id) => {
        const output = new Output();
        const container = new Container();
        container.setSingleton(id, { run: () => output });

        expect(handler(container, route)).toBe(output);
    });
});
