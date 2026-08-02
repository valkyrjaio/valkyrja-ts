/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
