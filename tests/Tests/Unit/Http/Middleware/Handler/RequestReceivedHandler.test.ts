/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it, vi } from 'vitest';

import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { RequestReceivedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RequestReceivedHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

const request = {} as ServerRequestContract;

class Mw {
    requestReceived = vi.fn(() => new Response());
}

describe('RequestReceivedHandler', () => {
    it('passes the request through when there is no middleware', () => {
        expect(new RequestReceivedHandler(new Container()).requestReceived(request)).toBe(request);
    });

    it('delegates to the next middleware resolved from the container', () => {
        const container = new Container();
        const middleware = new Mw();
        container.setSingleton(Mw.name, middleware);

        expect(new RequestReceivedHandler(container, Mw).requestReceived(request)).toBeInstanceOf(Response);
        expect(middleware.requestReceived).toHaveBeenCalledTimes(1);
    });

    it('appends middleware to the chain via add', () => {
        const container = new Container();
        const middleware = new Mw();
        container.setSingleton(Mw.name, middleware);

        const handler = new RequestReceivedHandler(container);
        handler.add(Mw);

        expect(handler.requestReceived(request)).toBeInstanceOf(Response);
    });
});
