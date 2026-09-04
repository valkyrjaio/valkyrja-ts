/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it, vi } from 'vitest';

import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { CliRoutingServiceId } from '../../../../../../src/Valkyrja/Cli/Routing/Constant/CliRoutingServiceId.ts';
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { Router } from '../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Router.ts';
import { ArgumentMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentMode.ts';
import { ArgumentValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentValueMode.ts';
import { OptionMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionMode.ts';
import { OptionValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';
import { CliRoutingArgumentValuesValidationException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingArgumentValuesValidationException.ts';
import { CliRoutingInvalidOptionWithValueException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingInvalidOptionWithValueException.ts';
import { CliRoutingOptionValuesValidationException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingOptionValuesValidationException.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { RouteContract } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

describe('Router', () => {
    it('dispatches a matching route through its handler', () => {
        const output = new Output();
        const handler = vi.fn((): OutputContract => output);
        const route = new Route('build', 'desc', handler);
        const container = new Container();
        const router = new Router(container, new RouteCollection().add(route));

        const result = router.dispatch(new Input('cli', 'build'));

        expect(handler).toHaveBeenCalledTimes(1);
        expect(result).toBe(output);
        expect(container.isSingletonInstance(CliRoutingServiceId.RouteContract)).toBe(true);
    });

    it('returns a not-matched output when no route matches', () => {
        const router = new Router(new Container(), new RouteCollection());

        const result = router.dispatch(new Input('cli', 'missing'));

        expect(OutputContract.instanceOf(result)).toBe(true);
    });

    it('binds default and array arguments to their parameters', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withArguments(
            new ArgumentParameter('first', 'first'),
            new ArgumentParameter('rest', 'rest').withValueMode(ArgumentValueMode.ARRAY),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withArguments(new Argument('a'), new Argument('b'), new Argument('c'));

        router.dispatch(input);

        expect(receivedRoute?.getArgument('first').getFirstValue()).toBe('a');
        expect(receivedRoute?.getArgument('rest').getArguments()).toHaveLength(2);
    });

    it('fills every positional argument parameter in order', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('list:bash', 'desc', handler).withArguments(
            new ArgumentParameter('applicationName', 'The application name'),
            new ArgumentParameter('namespace', 'An optional namespace'),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'list:bash').withArguments(new Argument('cli'), new Argument('list:'));

        router.dispatch(input);

        expect(receivedRoute?.getArgument('applicationName').getFirstValue()).toBe('cli');
        expect(receivedRoute?.getArgument('namespace').getFirstValue()).toBe('list:');
    });

    it('gives nothing to a parameter that follows an array parameter', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withArguments(
            new ArgumentParameter('rest', 'rest').withValueMode(ArgumentValueMode.ARRAY),
            new ArgumentParameter('trailing', 'trailing'),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        router.dispatch(new Input('cli', 'build').withArguments(new Argument('a'), new Argument('b')));

        expect(receivedRoute?.getArgument('rest').getArguments()).toHaveLength(2);
        expect(receivedRoute?.getArgument('trailing').getArguments()).toHaveLength(0);
    });

    it('returns early when route-matched middleware produces an output', () => {
        const earlyOutput = new Output();
        const routeMatchedHandler = {
            add: (): void => {},
            routeMatched: (): OutputContract => earlyOutput,
        };
        const handler = vi.fn((): OutputContract => new Output());
        const route = new Route('build', 'desc', handler);
        const router = new Router(
            new Container(),
            new RouteCollection().add(route),
            undefined,
            undefined,
            routeMatchedHandler,
        );

        const result = router.dispatch(new Input('cli', 'build'));

        expect(result).toBe(earlyOutput);
        expect(handler).not.toHaveBeenCalled();
    });

    it('leaves a default argument parameter empty when no value is supplied', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withArguments(new ArgumentParameter('first', 'first'));
        const router = new Router(new Container(), new RouteCollection().add(route));

        router.dispatch(new Input('cli', 'build'));

        expect(receivedRoute?.getArgument('first').getArguments()).toHaveLength(0);
    });

    it('binds options to their parameters by name', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withOptions(new OptionParameter('verbose', 'verbose'));
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withOptions(new Option('verbose'));

        router.dispatch(input);

        expect(receivedRoute?.getOption('verbose').getOptions()).toHaveLength(1);
    });

    it('binds options to their parameters by short name', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withOptions(
            new OptionParameter('verbose', 'verbose').withShortNames('v'),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withOptions(new Option('v'));

        router.dispatch(input);

        expect(receivedRoute?.getOption('verbose').getOptions()).toHaveLength(1);
    });

    it('binds multiple options to an array option parameter', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withOptions(
            new OptionParameter('tag', 'tag').withValueMode(OptionValueMode.ARRAY),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withOptions(new Option('tag', 'a'), new Option('tag', 'b'));

        router.dispatch(input);

        expect(receivedRoute?.getOption('tag').getOptions()).toHaveLength(2);
    });

    it('leaves an unmatched option parameter empty', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withOptions(new OptionParameter('unused', 'unused'));
        const router = new Router(new Container(), new RouteCollection().add(route));

        router.dispatch(new Input('cli', 'build').withOptions(new Option('other')));

        expect(receivedRoute?.getOption('unused').getOptions()).toHaveLength(0);
    });

    it('throws when a valueless flag option receives a value', () => {
        const route = new Route('build', 'desc', (): OutputContract => new Output()).withOptions(
            new OptionParameter('flag', 'flag').withValueMode(OptionValueMode.NONE),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withOptions(new Option('flag', 'nope'));

        expect(() => router.dispatch(input)).toThrow(CliRoutingInvalidOptionWithValueException);
    });

    it('throws when a required option is missing', () => {
        const route = new Route('build', 'desc', (): OutputContract => new Output()).withOptions(
            new OptionParameter('required', 'required').withMode(OptionMode.REQUIRED),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        expect(() => router.dispatch(new Input('cli', 'build'))).toThrow(CliRoutingOptionValuesValidationException);
    });

    it('throws when a single-value option receives multiple values', () => {
        const route = new Route('build', 'desc', (): OutputContract => new Output()).withOptions(
            new OptionParameter('single', 'single').withValueMode(OptionValueMode.DEFAULT),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withOptions(new Option('single', 'a'), new Option('single', 'b'));

        expect(() => router.dispatch(input)).toThrow(CliRoutingOptionValuesValidationException);
    });

    it('throws when a required argument is missing', () => {
        const route = new Route('build', 'desc', (): OutputContract => new Output()).withArguments(
            new ArgumentParameter('required', 'required').withMode(ArgumentMode.REQUIRED),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        expect(() => router.dispatch(new Input('cli', 'build'))).toThrow(CliRoutingArgumentValuesValidationException);
    });
});
