/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readSync } from 'node:fs';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Input } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { RouteCollection } from '../../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { Route } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { CheckCommandForTypoMiddleware } from '../../../../../../../src/Valkyrja/Cli/Server/Middleware/RouteNotMatched/CheckCommandForTypoMiddleware.ts';

import type { OutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { RouteNotMatchedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { RouterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

vi.mock('node:fs', () => ({ readSync: vi.fn() }));

const readSyncMock = vi.mocked(readSync);
const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

function feedStdin(input: string): void {
    const bytes = Buffer.from(input, 'utf8');
    let index = 0;
    readSyncMock.mockImplementation(((_fd: number, buffer: Buffer, offset: number): number => {
        if (index >= bytes.length) {
            return 0;
        }
        buffer[offset] = bytes[index] ?? 0;
        index += 1;

        return 1;
    }) as unknown as typeof readSync);
}

const passthroughHandler = {
    routeNotMatched: (_input: unknown, output: OutputContract): OutputContract => output,
} as unknown as RouteNotMatchedHandlerContract;

const handler = (): OutputContract => new Output();

class TestableTypoMiddleware extends CheckCommandForTypoMiddleware {
    public similar(a: string, b: string): number {
        return this.similarText(a, b);
    }

    public matched(commands: Route[], response: string): Route | null {
        return this.getMatchedRoute(commands, response) as Route | null;
    }
}

beforeEach(() => {
    readSyncMock.mockReset();
    stdoutSpy.mockClear();
});

afterEach(() => {
    readSyncMock.mockReset();
});

describe('CheckCommandForTypoMiddleware', () => {
    it('returns the output unchanged when no command is similar', () => {
        const collection = new RouteCollection().add(new Route('build', 'desc', handler));
        const router = { dispatch: vi.fn() } as unknown as RouterContract;
        const middleware = new CheckCommandForTypoMiddleware(router, collection);

        const output = new Output();
        const result = middleware.routeNotMatched(new Input('cli', 'zzzzz'), output, passthroughHandler);

        expect(result).toBe(output);
        expect(router.dispatch).not.toHaveBeenCalled();
    });

    it('keeps the default answer when the user declines a suggestion', () => {
        feedStdin('no\n');
        const collection = new RouteCollection().add(new Route('build', 'desc', handler));
        const router = { dispatch: vi.fn() } as unknown as RouterContract;
        const middleware = new CheckCommandForTypoMiddleware(router, collection);

        middleware.routeNotMatched(new Input('cli', 'biuld'), new Output(), passthroughHandler);

        expect(router.dispatch).not.toHaveBeenCalled();
    });

    it('dispatches the suggested command when the user accepts it', () => {
        feedStdin('build\n');
        const collection = new RouteCollection().add(new Route('build', 'desc', handler));
        const dispatched = new Output();
        const router = { dispatch: vi.fn(() => dispatched) } as unknown as RouterContract;
        const middleware = new CheckCommandForTypoMiddleware(router, collection);

        const result = middleware.routeNotMatched(new Input('cli', 'biuld'), new Output(), passthroughHandler);

        expect(router.dispatch).toHaveBeenCalledTimes(1);
        expect(result).toBe(dispatched);
    });

    it('scores identical and empty strings, and resolves a matched route or null', () => {
        const buildRoute = new Route('build', 'desc', handler);
        const collection = new RouteCollection().add(buildRoute);
        const router = { dispatch: vi.fn() } as unknown as RouterContract;
        const middleware = new TestableTypoMiddleware(router, collection);

        expect(middleware.similar('build', 'build')).toBe(100);
        expect(middleware.similar('', 'build')).toBe(0);
        expect(middleware.similar('build', '')).toBe(0);

        expect(middleware.matched([buildRoute], 'build')).toBe(buildRoute);
        expect(middleware.matched([buildRoute], 'unknown')).toBeNull();
    });
});
