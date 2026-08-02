/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
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
});
