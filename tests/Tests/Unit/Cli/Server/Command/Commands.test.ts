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
import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { ListBashCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/ListBashCommand.ts';
import { ListCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/ListCommand.ts';
import { VersionCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/VersionCommand.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();
const outputFactory = (): OutputFactory => new OutputFactory(new CliInteractionConfig());

function textOf(output: OutputContract): string {
    return output
        .getMessages()
        .map((message) => message.getText())
        .join('');
}

describe('VersionCommand', () => {
    it('renders a header with the application version', () => {
        const route = new Route('version', 'desc', handler);
        const output = new VersionCommand(outputFactory(), new CliConfig(), route).run();

        expect(textOf(output)).toContain('╭── App');
    });

    it('exposes help text', () => {
        expect(VersionCommand.help().getText()).toContain('version');
    });
});

describe('ListCommand', () => {
    it('lists all commands sorted by name', () => {
        const collection = new RouteCollection().add(
            new Route('zebra', 'Z command', handler),
            new Route('alpha', 'A command', handler),
        );
        const route = new Route('list', 'desc', handler);
        const output = new ListCommand(new CliConfig(), route, collection, outputFactory()).run();

        const text = textOf(output);
        expect(text).toContain('alpha');
        expect(text).toContain('zebra');
        expect(text.indexOf('alpha')).toBeLessThan(text.indexOf('zebra'));
    });

    it('filters by namespace when the option is present', () => {
        const collection = new RouteCollection().add(
            new Route('app:build', 'Build', handler),
            new Route('db:migrate', 'Migrate', handler),
        );
        const route = new Route('list', 'desc', handler).withOptions(
            new OptionParameter('namespace', 'ns').withOptions(new Option('namespace', 'app')),
        );
        const output = new ListCommand(new CliConfig(), route, collection, outputFactory()).run();

        const text = textOf(output);
        expect(text).toContain('app:build');
        expect(text).not.toContain('db:migrate');
    });

    it('returns an error when a namespace matches nothing', () => {
        const collection = new RouteCollection().add(new Route('app:build', 'Build', handler));
        const route = new Route('list', 'desc', handler).withOptions(
            new OptionParameter('namespace', 'ns').withOptions(new Option('namespace', 'missing')),
        );
        const output = new ListCommand(new CliConfig(), route, collection, outputFactory()).run();

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(textOf(output)).toContain('missing');
    });

    it('returns an error when there are no routes', () => {
        const output = new ListCommand(
            new CliConfig(),
            new Route('list', 'desc', handler),
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

describe('ListBashCommand', () => {
    it('lists all command names for bash completion', () => {
        const collection = new RouteCollection().add(
            new Route('build', 'desc', handler),
            new Route('test', 'desc', handler),
        );
        const output = new ListBashCommand(new Route('list:bash', 'desc', handler), collection, outputFactory()).run();

        expect(textOf(output)).toBe('build test');
    });

    it('strips the namespace prefix when a namespace argument is given', () => {
        const collection = new RouteCollection().add(
            new Route('app:build', 'desc', handler),
            new Route('db:migrate', 'desc', handler),
        );
        const route = new Route('list:bash', 'desc', handler).withArguments(
            new ArgumentParameter('namespace', 'ns').withArguments(new Argument('app:')),
        );
        const output = new ListBashCommand(route, collection, outputFactory()).run();

        expect(textOf(output)).toBe('build');
    });

    it('exposes help text', () => {
        expect(ListBashCommand.help().getText()).toContain('bash');
    });
});
