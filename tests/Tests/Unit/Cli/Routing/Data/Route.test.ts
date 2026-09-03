/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { CliRoutingInvalidArgumentNameException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingInvalidArgumentNameException.ts';
import { CliRoutingInvalidOptionNameException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingInvalidOptionNameException.ts';
import { CliRoutingNoHelpTextException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingNoHelpTextException.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => ({}) as unknown as OutputContract;

describe('Route', () => {
    it('exposes its name, description, and handler immutably', () => {
        const route = new Route('build', 'Builds the app', handler);

        expect(route.getName()).toBe('build');
        expect(route.getDescription()).toBe('Builds the app');
        expect(route.getHandler()).toBe(handler);

        expect(route.withName('compile').getName()).toBe('compile');
        expect(route.withDescription('Compiles').getDescription()).toBe('Compiles');

        const otherHandler = (): OutputContract => ({}) as unknown as OutputContract;
        expect(route.withHandler(otherHandler).getHandler()).toBe(otherHandler);
    });

    it('manages help text and throws when missing', () => {
        const route = new Route('build', 'desc', handler);

        expect(route.hasHelpText()).toBe(false);
        expect(() => route.getHelpText()).toThrow(CliRoutingNoHelpTextException);

        const message = new Message('help');
        const withHelp = route.withHelpText(() => message);
        expect(withHelp.hasHelpText()).toBe(true);
        expect(withHelp.getHelpText()()).toBe(message);
        expect(withHelp.getHelpTextMessage()).toBe(message);
    });

    it('manages arguments and looks them up by name', () => {
        const argument = new ArgumentParameter('source', 'The source');
        const route = new Route('build', 'desc', handler).withArguments(argument);

        expect(route.hasArguments()).toBe(true);
        expect(route.getArguments()).toHaveLength(1);
        expect(route.hasArgument('source')).toBe(true);
        expect(route.getArgument('source')).toBe(argument);
        expect(() => route.getArgument('missing')).toThrow(CliRoutingInvalidArgumentNameException);
        expect(route.withAddedArguments(new ArgumentParameter('dest', 'd')).getArguments()).toHaveLength(2);
    });

    it('manages options and looks them up by name', () => {
        const option = new OptionParameter('verbose', 'Verbose');
        const route = new Route('build', 'desc', handler).withOptions(option);

        expect(route.hasOptions()).toBe(true);
        expect(route.getOptions()).toHaveLength(1);
        expect(route.hasOption('verbose')).toBe(true);
        expect(route.getOption('verbose')).toBe(option);
        expect(() => route.getOption('missing')).toThrow(CliRoutingInvalidOptionNameException);
        expect(route.withAddedOptions(new OptionParameter('quiet', 'q')).getOptions()).toHaveLength(2);
    });

    it('manages each middleware group immutably', () => {
        const route = new Route('build', 'desc', handler);

        expect(route.withRouteMatchedMiddleware('a').getRouteMatchedMiddleware()).toStrictEqual(['a']);
        expect(
            route.withRouteMatchedMiddleware('a').withAddedRouteMatchedMiddleware('b').getRouteMatchedMiddleware(),
        ).toStrictEqual(['a', 'b']);

        expect(route.withRouteDispatchedMiddleware('a').getRouteDispatchedMiddleware()).toStrictEqual(['a']);
        expect(
            route
                .withRouteDispatchedMiddleware('a')
                .withAddedRouteDispatchedMiddleware('b')
                .getRouteDispatchedMiddleware(),
        ).toStrictEqual(['a', 'b']);

        expect(route.withThrowableCaughtMiddleware('a').getThrowableCaughtMiddleware()).toStrictEqual(['a']);
        expect(
            route
                .withThrowableCaughtMiddleware('a')
                .withAddedThrowableCaughtMiddleware('b')
                .getThrowableCaughtMiddleware(),
        ).toStrictEqual(['a', 'b']);

        expect(route.withProcessExitingMiddleware('a').getProcessExitingMiddleware()).toStrictEqual(['a']);
        expect(
            route
                .withProcessExitingMiddleware('a')
                .withAddedProcessExitingMiddleware('b')
                .getProcessExitingMiddleware(),
        ).toStrictEqual(['a', 'b']);
    });

    it('reports a provided option separately from a declared one', () => {
        const bare = new Route('list', 'd', handler);
        const declared = bare.withOptions(new OptionParameter('namespace', 'ns'));
        const provided = bare.withOptions(
            new OptionParameter('namespace', 'ns').withOptions(new Option('namespace', 'db:')),
        );

        expect(bare.hasProvidedOption('namespace')).toBe(false);
        expect(bare.getOptionValue('namespace', 'all')).toBe('all');

        expect(declared.hasOption('namespace')).toBe(true);
        expect(declared.hasProvidedOption('namespace')).toBe(false);
        expect(declared.getOptionValue('namespace', 'all')).toBe('all');

        expect(provided.hasProvidedOption('namespace')).toBe(true);
        expect(provided.getOptionValue('namespace', 'all')).toBe('db:');
        expect(provided.getOptionValue('namespace')).toBe('db:');
    });

    it('falls back to the declared default of an option', () => {
        const bare = new Route('list', 'd', handler);
        const withDefault = bare.withOptions(new OptionParameter('namespace', 'ns').withDefaultValue('app:'));
        const withoutDefault = bare.withOptions(new OptionParameter('namespace', 'ns'));

        expect(withDefault.getOptionValue('namespace')).toBe('app:');
        expect(withDefault.getOptionValue('namespace', 'all')).toBe('all');
        expect(withoutDefault.getOptionValue('namespace')).toBe('');
        // An empty string given at the call site counts as given, so it suppresses the
        // declared default. Only an omitted or null default reaches the declaration.
        expect(withDefault.getOptionValue('namespace', '')).toBe('');
        expect(withDefault.getOptionValue('namespace', null)).toBe('app:');
    });

    it('reports a provided argument separately from a declared one', () => {
        const bare = new Route('list:bash', 'd', handler);
        const declared = bare.withArguments(new ArgumentParameter('namespace', 'ns'));
        const provided = bare.withArguments(
            new ArgumentParameter('namespace', 'ns').withArguments(new Argument('db:')),
        );

        expect(bare.hasProvidedArgument('namespace')).toBe(false);
        expect(bare.getArgumentValue('namespace', 'all')).toBe('all');

        expect(declared.hasArgument('namespace')).toBe(true);
        expect(declared.hasProvidedArgument('namespace')).toBe(false);
        expect(declared.getArgumentValue('namespace', 'all')).toBe('all');

        expect(provided.hasProvidedArgument('namespace')).toBe(true);
        expect(provided.getArgumentValue('namespace', 'all')).toBe('db:');
        expect(provided.getArgumentValue('namespace')).toBe('db:');
    });
});
