/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { StatusText } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusText.ts';
import { Cookie } from '../../../../../../src/Valkyrja/Http/Message/Header/Value/Cookie.ts';
import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';

describe('Response', () => {
    it('defaults to a 200 OK response', () => {
        const response = new Response();

        expect(response.getStatusCode()).toBe(StatusCode.OK);
        expect(response.getReasonPhrase()).toBe(StatusText.OK);
    });

    it('creates a response with body content', () => {
        const response = Response.create('hello', StatusCode.CREATED);

        expect(response.getStatusCode()).toBe(StatusCode.CREATED);
        expect(response.getBody().getContents()).toBe('hello');
    });

    it('updates the status code and reason phrase immutably', () => {
        const response = new Response();

        const notFound = response.withStatusCode(StatusCode.NOT_FOUND);
        expect(notFound.getStatusCode()).toBe(StatusCode.NOT_FOUND);
        expect(notFound.getReasonPhrase()).toBe(StatusText.NOT_FOUND);

        expect(response.withReasonPhrase('Custom').getReasonPhrase()).toBe('Custom');
        expect(response.withReasonPhrase('').getReasonPhrase()).toBe(StatusText.OK);
    });

    it('adds and removes cookies via set-cookie headers', () => {
        const response = new Response();
        const cookie = new Cookie('session', 'abc');

        expect(response.withCookie(cookie).getHeaders().has(HeaderName.SET_COOKIE)).toBe(true);
        expect(response.withoutCookie(cookie).getHeaders().has(HeaderName.SET_COOKIE)).toBe(true);
    });

    it('creates a new instance through the instance create method', () => {
        const response = new Response().create('body', StatusCode.ACCEPTED);

        expect(response.getStatusCode()).toBe(StatusCode.ACCEPTED);
    });

    it('applies defaults when the instance create method is called with no arguments', () => {
        const response = new Response().create();

        expect(response.getStatusCode()).toBe(StatusCode.OK);
        expect(response.getBody().getContents()).toBe('');
    });
});
