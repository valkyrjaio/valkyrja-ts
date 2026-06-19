/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { NoCacheResponseMiddleware } from '../../../../../../../src/Valkyrja/Http/Server/Middleware/SendingResponse/NoCacheResponseMiddleware.ts';

import type { ServerRequestContract } from '../../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { SendingResponseHandlerContract } from '../../../../../../../src/Valkyrja/Http/Middleware/Handler/Contract/SendingResponseHandlerContract.ts';

const request = {} as ServerRequestContract;
const handler = {
    sendingResponse: (_request: ServerRequestContract, response: ResponseContract): ResponseContract => response,
} as SendingResponseHandlerContract;

describe('NoCacheResponseMiddleware', () => {
    it('adds no-cache headers to the response', () => {
        const result = new NoCacheResponseMiddleware().sendingResponse(request, new Response(), handler);

        const headers = result.getHeaders();
        expect(headers.has(HeaderName.EXPIRES)).toBe(true);
        expect(headers.has(HeaderName.CACHE_CONTROL)).toBe(true);
        expect(headers.has(HeaderName.PRAGMA)).toBe(true);
        expect(headers.getHeaderLine(HeaderName.CACHE_CONTROL)).toContain('no-cache');
    });
});
