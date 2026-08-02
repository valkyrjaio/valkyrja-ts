/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/RouteNotMatchedHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

describe('RouteNotMatchedHandler', () => {
    it('passes the output through when there is no middleware', () => {
        const output = new Output();

        expect(new RouteNotMatchedHandler(new Container()).routeNotMatched(new Input(), output)).toBe(output);
    });

    it('delegates to the next middleware', () => {
        const other = new Output();
        const container = new Container();
        container.setSingleton('mw', { routeNotMatched: vi.fn(() => other) });

        expect(new RouteNotMatchedHandler(container, 'mw').routeNotMatched(new Input(), new Output())).toBe(other);
    });
});
