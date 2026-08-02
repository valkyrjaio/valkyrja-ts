/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it, vi } from 'vitest';

import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ResponseSentHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

const request = {} as ServerRequestContract;

class Mw {
    responseSent = vi.fn();
}

describe('ResponseSentHandler', () => {
    it('does nothing when there is no middleware', () => {
        expect(() => {
            new ResponseSentHandler(new Container()).responseSent(request, new Response());
        }).not.toThrow();
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        const middleware = new Mw();
        container.setSingleton(Mw.name, middleware);

        new ResponseSentHandler(container, Mw).responseSent(request, new Response());

        expect(middleware.responseSent).toHaveBeenCalledTimes(1);
    });
});
