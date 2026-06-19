/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { JsonResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/JsonResponse.ts';
import { HttpRequestInvalidJsonCallbackException } from '../../../../../../src/Valkyrja/Http/Message/Response/Throwable/Exception/HttpRequestInvalidJsonCallbackException.ts';

describe('JsonResponse', () => {
    it('serializes data as a json body', () => {
        const response = new JsonResponse({ a: 1 });

        expect(response.getHeaders().getHeaderLine(HeaderName.CONTENT_TYPE)).toContain('application/json');
        expect(response.getBodyAsJson()).toStrictEqual({ a: 1 });
    });

    it('creates from data statically and through the instance', () => {
        expect(JsonResponse.createFromData({ b: 2 }, StatusCode.CREATED).getStatusCode()).toBe(StatusCode.CREATED);
        expect(new JsonResponse().createFromData({ c: 3 }).getBodyAsJson()).toStrictEqual({ c: 3 });
    });

    it('parses content as json in create', () => {
        expect(new JsonResponse().create('{"d":4}').getBodyAsJson()).toStrictEqual({ d: 4 });
        expect(new JsonResponse().create(null).getBodyAsJson()).toStrictEqual({});
    });

    it('replaces the body with new json', () => {
        const response = new JsonResponse({ a: 1 }).withJsonAsBody({ e: 5 });

        expect(response.getBodyAsJson()).toStrictEqual({ e: 5 });
    });

    it('wraps the body in a jsonp callback and unwraps it', () => {
        const response = new JsonResponse({ a: 1 });

        const jsonp = response.withCallback('handleData');
        expect(jsonp.getBody().getContents()).toBe('/**/handleData({"a":1});');

        const reverted = jsonp.withoutCallback();
        expect(reverted.getBody().getContents()).toBe('{"a":1}');
    });

    it('rejects an invalid callback name', () => {
        expect(() => new JsonResponse({ a: 1 }).withCallback('not valid')).toThrow(
            HttpRequestInvalidJsonCallbackException,
        );
    });
});
