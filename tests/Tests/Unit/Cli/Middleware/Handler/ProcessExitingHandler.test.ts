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
import { ProcessExitingHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/ProcessExitingHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

describe('ProcessExitingHandler', () => {
    it('does nothing when there is no middleware', () => {
        expect(() => {
            new ProcessExitingHandler(new Container()).processExiting(new Input(), new Output());
        }).not.toThrow();
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        const middleware = { processExiting: vi.fn() };
        container.setSingleton('mw', middleware);

        new ProcessExitingHandler(container, 'mw').processExiting(new Input(), new Output());

        expect(middleware.processExiting).toHaveBeenCalledTimes(1);
    });
});
