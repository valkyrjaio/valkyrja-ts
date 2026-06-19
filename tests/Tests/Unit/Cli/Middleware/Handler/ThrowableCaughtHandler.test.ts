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
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/ThrowableCaughtHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

describe('ThrowableCaughtHandler', () => {
    it('passes the output through when there is no middleware', () => {
        const output = new Output();

        expect(new ThrowableCaughtHandler(new Container()).throwableCaught(new Input(), output, new Error('x'))).toBe(
            output,
        );
    });

    it('delegates to the next middleware', () => {
        const other = new Output();
        const container = new Container();
        container.setSingleton('mw', { throwableCaught: vi.fn(() => other) });

        expect(
            new ThrowableCaughtHandler(container, 'mw').throwableCaught(new Input(), new Output(), new Error('x')),
        ).toBe(other);
    });
});
