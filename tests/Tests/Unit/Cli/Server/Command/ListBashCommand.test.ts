/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { ListBashCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/ListBashCommand.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();
const outputFactory = (): OutputFactory => new OutputFactory(new CliInteractionConfig());

function textOf(output: OutputContract): string {
    return output
        .getMessages()
        .map((message) => message.getText())
        .join('');
}

describe('ListBashCommand', () => {
    it('lists all command names for bash completion', () => {
        const collection = new RouteCollection().add(new Route('build', 'd', handler), new Route('test', 'd', handler));
        const output = new ListBashCommand(new Route('list:bash', 'd', handler), collection, outputFactory()).run();

        expect(textOf(output)).toBe('build test');
    });

    it('strips the namespace prefix when a namespace argument is given', () => {
        const collection = new RouteCollection().add(
            new Route('app:build', 'd', handler),
            new Route('db:migrate', 'd', handler),
        );
        const route = new Route('list:bash', 'd', handler).withArguments(
            new ArgumentParameter('namespace', 'ns').withArguments(new Argument('app:')),
        );
        const output = new ListBashCommand(route, collection, outputFactory()).run();

        expect(textOf(output)).toBe('build');
    });

    it('exposes help text', () => {
        expect(ListBashCommand.help().getText()).toContain('bash');
    });
});
