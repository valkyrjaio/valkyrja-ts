/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { HeaderCollection } from '../../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { HttpResponseException } from '../../../../../../../src/Valkyrja/Http/Message/Throwable/Exception/HttpResponseException.ts';

describe('HttpResponseException', () => {
    it('uses the given status code and exposes its headers', () => {
        const headers = new HeaderCollection();
        const exception = new HttpResponseException(StatusCode.BAD_REQUEST, 'bad', headers);

        expect(exception.getStatusCode()).toBe(StatusCode.BAD_REQUEST);
        expect(exception.getHeaders()).toBe(headers);
        expect(exception.getResponse()).toBeNull();
    });

    it('derives the status code from the carried response', () => {
        const exception = new HttpResponseException(null, null, null, new Response(undefined, StatusCode.CREATED));

        expect(exception.getStatusCode()).toBe(StatusCode.CREATED);
        expect(exception.getResponse()?.getStatusCode()).toBe(StatusCode.CREATED);
    });

    it('defaults to a 500 status code', () => {
        expect(new HttpResponseException().getStatusCode()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    });
});
