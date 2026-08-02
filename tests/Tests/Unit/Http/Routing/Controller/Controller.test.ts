/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Controller } from '../../../../../../src/Valkyrja/Http/Routing/Controller/Controller.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseFactoryContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Factory/Contract/ResponseFactoryContract.ts';

class TestController extends Controller {
    getRequest(): ServerRequestContract {
        return this.request;
    }

    getResponseFactory(): ResponseFactoryContract {
        return this.responseFactory;
    }
}

describe('Controller', () => {
    it('stores the request and response factory it was constructed with', () => {
        const request = {} as ServerRequestContract;
        const responseFactory = {} as ResponseFactoryContract;

        const controller = new TestController(request, responseFactory);

        expect(controller.getRequest()).toBe(request);
        expect(controller.getResponseFactory()).toBe(responseFactory);
    });
});
