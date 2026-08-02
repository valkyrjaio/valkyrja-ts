/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ThrowableCaughtHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

const request = {} as ServerRequestContract;

class Mw {
    throwableCaught = vi.fn(() => new Response());
}

describe('ThrowableCaughtHandler', () => {
    it('passes the response through when there is no middleware', () => {
        const response = new Response();

        expect(new ThrowableCaughtHandler(new Container()).throwableCaught(request, response, new Error('x'))).toBe(
            response,
        );
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        const other = new Response();
        const middleware = new Mw();
        middleware.throwableCaught.mockReturnValue(other);
        container.setSingleton(Mw.name, middleware);

        expect(new ThrowableCaughtHandler(container, Mw).throwableCaught(request, new Response(), new Error('x'))).toBe(
            other,
        );
    });
});
