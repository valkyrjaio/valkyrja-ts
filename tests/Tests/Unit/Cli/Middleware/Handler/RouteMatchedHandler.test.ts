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
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteMatchedHandler.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const route = new Route('build', 'desc', (): OutputContract => new Output());

describe('RouteMatchedHandler', () => {
    it('passes the route through when there is no middleware', () => {
        expect(new RouteMatchedHandler(new Container()).routeMatched(new Input(), route)).toBe(route);
    });

    it('delegates to the next middleware', () => {
        const output = new Output();
        const container = new Container();
        container.setSingleton('mw', { routeMatched: vi.fn(() => output) });

        expect(new RouteMatchedHandler(container, 'mw').routeMatched(new Input(), route)).toBe(output);
    });
});
