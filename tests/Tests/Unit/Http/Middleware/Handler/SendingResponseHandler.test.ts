/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it, vi } from 'vitest';

import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/SendingResponseHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

const request = {} as ServerRequestContract;

class Mw {
    sendingResponse = vi.fn(() => new Response());
}

describe('SendingResponseHandler', () => {
    it('passes the response through when there is no middleware', () => {
        const response = new Response();

        expect(new SendingResponseHandler(new Container()).sendingResponse(request, response)).toBe(response);
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        const other = new Response();
        const middleware = new Mw();
        middleware.sendingResponse.mockReturnValue(other);
        container.setSingleton(Mw.name, middleware);

        expect(new SendingResponseHandler(container, Mw).sendingResponse(request, new Response())).toBe(other);
    });
});
