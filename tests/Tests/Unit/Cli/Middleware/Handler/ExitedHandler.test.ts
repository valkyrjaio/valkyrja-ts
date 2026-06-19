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
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

describe('ExitedHandler', () => {
    it('does nothing when there is no middleware', () => {
        expect(() => new ExitedHandler(new Container()).exited(new Input(), new Output())).not.toThrow();
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        const middleware = { exited: vi.fn() };
        container.setSingleton('mw', middleware);

        new ExitedHandler(container, 'mw').exited(new Input(), new Output());

        expect(middleware.exited).toHaveBeenCalledTimes(1);
    });
});
