/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { JsonResponse } from '../../../../../../../src/Valkyrja/Http/Message/Response/JsonResponse.ts';
import { RedirectResponse } from '../../../../../../../src/Valkyrja/Http/Message/Response/RedirectResponse.ts';
import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { ResponseFactory } from '../../../../../../../src/Valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';
import { TextResponse } from '../../../../../../../src/Valkyrja/Http/Message/Response/TextResponse.ts';

describe('ResponseFactory', () => {
    const factory = new ResponseFactory();

    it('creates each response type', () => {
        expect(factory.createResponse('body')).toBeInstanceOf(Response);
        expect(factory.createTextResponse('text')).toBeInstanceOf(TextResponse);
        expect(factory.createJsonResponse({ a: 1 })).toBeInstanceOf(JsonResponse);
        expect(factory.createRedirectResponse('/home')).toBeInstanceOf(RedirectResponse);
    });

    it('creates a jsonp response with a callback', () => {
        const response = factory.createJsonpResponse('cb', { a: 1 });

        expect(response.getBody().getContents()).toBe('/**/cb({"a":1});');
    });

    it('honors a supplied status code', () => {
        expect(factory.createResponse('body', StatusCode.ACCEPTED).getStatusCode()).toBe(StatusCode.ACCEPTED);
    });

    it('redirects to the root path when no uri is supplied', () => {
        expect(factory.createRedirectResponse()).toBeInstanceOf(RedirectResponse);
    });
});
