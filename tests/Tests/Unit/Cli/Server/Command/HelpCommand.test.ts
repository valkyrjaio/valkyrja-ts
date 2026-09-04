/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliConfig } from '../../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { ArgumentValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentValueMode.ts';
import { OptionMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionMode.ts';
import { OptionValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';
import { HelpCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/HelpCommand.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();
const outputFactory = (): OutputFactory => new OutputFactory(new CliInteractionConfig());

function helpRouteFor(commandName: string): Route {
    return new Route('help', 'desc', handler).withOptions(
        new OptionParameter('command', 'ns').withOptions(new Option('command', commandName)),
    );
}

function textOf(output: OutputContract): string {
    return output
        .getMessages()
        .map((message) => message.getFormattedText())
        .join('');
}

class TestableHelpCommand extends HelpCommand {
    public indent(message: Message): Message {
        return this.getIndentedText(message) as Message;
    }
}

describe('HelpCommand', () => {
    it('returns an error when the command is unknown', () => {
        const output = new HelpCommand(
            new CliConfig(),
            helpRouteFor('missing'),
            new RouteCollection(),
            outputFactory(),
        ).run();

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(textOf(output)).toContain('missing');
    });

    it('renders rich help for a command with options, arguments, and help text', () => {
        const target = new Route(
            'build',
            'Builds the project from source into the configured output directory for distribution and testing, ' +
                'running every registered compilation step in order before finally writing the bundled artifacts.',
            handler,
        )
            .withHelpText(() => new Message('Run build to compile everything.'))
            .withOptions(
                new OptionParameter('verbose', 'Verbosity level')
                    .withShortNames('v')
                    .withValueDisplayName('LEVEL')
                    .withMode(OptionMode.REQUIRED)
                    .withValidValues('low', 'high')
                    .withDefaultValue('low'),
                new OptionParameter('tags', 'Tags to apply')
                    .withValueDisplayName('TAG')
                    .withValueMode(OptionValueMode.ARRAY),
            )
            .withArguments(
                new ArgumentParameter('source', 'The source directory'),
                new ArgumentParameter('rest', 'Remaining args').withValueMode(ArgumentValueMode.ARRAY),
            );

        const collection = new RouteCollection().add(target);
        const output = new HelpCommand(new CliConfig(), helpRouteFor('build'), collection, outputFactory()).run();

        const text = textOf(output);
        expect(text).toContain('Name: ');
        expect(text).toContain('build');
        expect(text).toContain('--verbose');
        expect(text).toContain('=LEVEL');
        expect(text).toContain('(default)');
        expect(text).toContain('--tags');
        expect(text).toContain('Global Options:');
        expect(text).toContain('Arguments:');
        expect(text).toContain('Run build to compile everything.');
        expect(text).toContain('[source]');
        expect(text).toContain('[rest...]');
    });

    it('renders minimal help for a command without options, arguments, or help text', () => {
        const target = new Route('simple', 'A simple command', handler);
        const collection = new RouteCollection().add(target);

        const output = new HelpCommand(new CliConfig(), helpRouteFor('simple'), collection, outputFactory()).run();

        const text = textOf(output);
        expect(text).toContain('simple');
        expect(text).toContain('Global Options:');
        expect(text).not.toContain('Arguments:');
    });

    it('exposes help text', () => {
        expect(HelpCommand.help().getText()).toContain('help');
    });

    it('wraps empty indented text without a trailing line', () => {
        const command = new TestableHelpCommand(
            new CliConfig(),
            helpRouteFor('x'),
            new RouteCollection(),
            outputFactory(),
        );

        expect(command.indent(new Message('')).getText()).toBe('');
    });

    it('reports the miss when the route declares no command option', () => {
        const output = new HelpCommand(
            new CliConfig(),
            new Route('help', 'desc', handler),
            new RouteCollection(),
            outputFactory(),
        ).run();

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(textOf(output)).toContain('was not found');
    });
});
