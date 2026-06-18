/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { ExitedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/ExitedHandler.ts';
import { InputReceivedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/InputReceivedHandler.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteNotMatchedHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/ThrowableCaughtHandler.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const input = new Input();
const output = new Output();
const route = new Route('build', 'desc', (): OutputContract => output);

describe('Cli Middleware handlers', () => {
    it('InputReceivedHandler passes through and delegates to middleware', () => {
        expect(new InputReceivedHandler(new Container()).inputReceived(input)).toBe(input);

        const container = new Container();
        const middleware = { inputReceived: vi.fn(() => output) };
        container.setSingleton('mw', middleware);

        const result = new InputReceivedHandler(container, 'mw').inputReceived(input);

        expect(middleware.inputReceived).toHaveBeenCalledTimes(1);
        expect(result).toBe(output);
    });

    it('RouteMatchedHandler passes through and delegates to middleware', () => {
        expect(new RouteMatchedHandler(new Container()).routeMatched(input, route)).toBe(route);

        const container = new Container();
        const middleware = { routeMatched: vi.fn(() => output) };
        container.setSingleton('mw', middleware);

        expect(new RouteMatchedHandler(container, 'mw').routeMatched(input, route)).toBe(output);
        expect(middleware.routeMatched).toHaveBeenCalledTimes(1);
    });

    it('RouteDispatchedHandler passes through and delegates to middleware', () => {
        expect(new RouteDispatchedHandler(new Container()).routeDispatched(input, output, route)).toBe(output);

        const container = new Container();
        const other = new Output();
        const middleware = { routeDispatched: vi.fn(() => other) };
        container.setSingleton('mw', middleware);

        expect(new RouteDispatchedHandler(container, 'mw').routeDispatched(input, output, route)).toBe(other);
    });

    it('RouteNotMatchedHandler passes through and delegates to middleware', () => {
        expect(new RouteNotMatchedHandler(new Container()).routeNotMatched(input, output)).toBe(output);

        const container = new Container();
        const other = new Output();
        const middleware = { routeNotMatched: vi.fn(() => other) };
        container.setSingleton('mw', middleware);

        expect(new RouteNotMatchedHandler(container, 'mw').routeNotMatched(input, output)).toBe(other);
    });

    it('ThrowableCaughtHandler passes through and delegates to middleware', () => {
        const throwable = new Error('boom');
        expect(new ThrowableCaughtHandler(new Container()).throwableCaught(input, output, throwable)).toBe(output);

        const container = new Container();
        const other = new Output();
        const middleware = { throwableCaught: vi.fn(() => other) };
        container.setSingleton('mw', middleware);

        expect(new ThrowableCaughtHandler(container, 'mw').throwableCaught(input, output, throwable)).toBe(other);
    });

    it('ExitedHandler passes through and delegates to middleware', () => {
        expect(() => new ExitedHandler(new Container()).exited(input, output)).not.toThrow();

        const container = new Container();
        const middleware = { exited: vi.fn() };
        container.setSingleton('mw', middleware);

        new ExitedHandler(container, 'mw').exited(input, output);

        expect(middleware.exited).toHaveBeenCalledTimes(1);
    });

    it('add appends middleware to the chain', () => {
        const container = new Container();
        const middleware = { inputReceived: vi.fn(() => output) };
        container.setSingleton('mw', middleware);

        const handler = new InputReceivedHandler(container);
        handler.add('mw');

        expect(handler.inputReceived(input)).toBe(output);
    });
});
