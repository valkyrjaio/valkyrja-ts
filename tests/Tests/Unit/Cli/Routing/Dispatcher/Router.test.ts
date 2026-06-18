/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
import { ArgumentValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentValueMode.ts';
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

        const input = new Input('cli', 'build').withArguments(
            new Argument('a'),
            new Argument('b'),
            new Argument('c'),
        );

        router.dispatch(input);

        expect(receivedRoute?.getArgument('first').getFirstValue()).toBe('a');
        expect(receivedRoute?.getArgument('rest').getArguments()).toHaveLength(2);
    });

    it('binds options to their parameters by name', () => {
        let receivedRoute: RouteContract | undefined;
        const handler = (_container: unknown, route: RouteContract): OutputContract => {
            receivedRoute = route;

            return new Output();
        };
        const route = new Route('build', 'desc', handler).withOptions(
            new OptionParameter('verbose', 'verbose'),
        );
        const router = new Router(new Container(), new RouteCollection().add(route));

        const input = new Input('cli', 'build').withOptions(new Option('verbose'));

        router.dispatch(input);

        expect(receivedRoute?.getOption('verbose').getOptions()).toHaveLength(1);
    });
});
