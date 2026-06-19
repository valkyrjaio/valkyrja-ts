/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliConfig } from '../../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { ListCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/ListCommand.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();
const outputFactory = (): OutputFactory => new OutputFactory(new CliInteractionConfig());

function textOf(output: OutputContract): string {
    return output
        .getMessages()
        .map((message) => message.getText())
        .join('');
}

describe('ListCommand', () => {
    it('lists all commands sorted by name', () => {
        const collection = new RouteCollection().add(
            new Route('zebra', 'Z command', handler),
            new Route('alpha', 'A command', handler),
        );
        const output = new ListCommand(
            new CliConfig(),
            new Route('list', 'd', handler),
            collection,
            outputFactory(),
        ).run();

        const text = textOf(output);
        expect(text).toContain('alpha');
        expect(text.indexOf('alpha')).toBeLessThan(text.indexOf('zebra'));
    });

    it('filters by namespace when the option is present', () => {
        const collection = new RouteCollection().add(
            new Route('app:build', 'Build', handler),
            new Route('db:migrate', 'Migrate', handler),
        );
        const route = new Route('list', 'd', handler).withOptions(
            new OptionParameter('namespace', 'ns').withOptions(new Option('namespace', 'app')),
        );
        const output = new ListCommand(new CliConfig(), route, collection, outputFactory()).run();

        const text = textOf(output);
        expect(text).toContain('app:build');
        expect(text).not.toContain('db:migrate');
    });

    it('returns an error when a namespace matches nothing', () => {
        const collection = new RouteCollection().add(new Route('app:build', 'Build', handler));
        const route = new Route('list', 'd', handler).withOptions(
            new OptionParameter('namespace', 'ns').withOptions(new Option('namespace', 'missing')),
        );
        const output = new ListCommand(new CliConfig(), route, collection, outputFactory()).run();

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(textOf(output)).toContain('missing');
    });

    it('returns an error when there are no routes', () => {
        const output = new ListCommand(
            new CliConfig(),
            new Route('list', 'd', handler),
            new RouteCollection(),
            outputFactory(),
        ).run();

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(textOf(output)).toContain('No routes found.');
    });

    it('exposes help text', () => {
        expect(ListCommand.help().getText()).toContain('list');
    });
});
