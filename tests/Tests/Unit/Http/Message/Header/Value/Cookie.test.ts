/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { SameSite } from '../../../../../../../src/Valkyrja/Http/Message/Enum/SameSite.ts';
import { Cookie } from '../../../../../../../src/Valkyrja/Http/Message/Header/Value/Cookie.ts';

describe('Cookie', () => {
    it('exposes its defaults', () => {
        const cookie = new Cookie('session', 'abc');

        expect(cookie.getName()).toBe('session');
        expect(cookie.getValue()).toBe('abc');
        expect(cookie.getExpire()).toBe(0);
        expect(cookie.getPath()).toBe('/');
        expect(cookie.getDomain()).toBe('');
        expect(cookie.isSecure()).toBe(false);
        expect(cookie.isHttpOnly()).toBe(true);
        expect(cookie.isRaw()).toBe(false);
        expect(cookie.getSameSite()).toBe(SameSite.LAX);
        expect(cookie.getMaxAge()).toBe(0);
    });

    it('manages every attribute immutably', () => {
        const cookie = new Cookie('session');

        expect(cookie.withName('id').getName()).toBe('id');
        expect(cookie.withValue('v').getValue()).toBe('v');
        expect(cookie.withExpire(123).getExpire()).toBe(123);
        expect(cookie.withPath('/app').getPath()).toBe('/app');
        expect(cookie.withDomain('example.com').getDomain()).toBe('example.com');
        expect(cookie.withSecure(true).isSecure()).toBe(true);
        expect(cookie.withHttpOnly(false).isHttpOnly()).toBe(false);
        expect(cookie.withRaw(true).isRaw()).toBe(true);
        expect(cookie.withSameSite(SameSite.STRICT).getSameSite()).toBe(SameSite.STRICT);
    });

    it('computes a positive max age for a future expiry', () => {
        const future = Math.floor(Date.now() / 1000) + 1000;

        expect(new Cookie('s', 'v').withExpire(future).getMaxAge()).toBeGreaterThan(0);
    });

    it('renders a minimal cookie string', () => {
        expect(new Cookie('session', 'abc').toString()).toBe('session=abc; path=/; httponly; samesite=lax');
    });

    it('renders all attributes when set', () => {
        const cookie = new Cookie('session', 'abc')
            .withExpire(Math.floor(Date.now() / 1000) + 1000)
            .withDomain('example.com')
            .withSecure(true);

        const string = cookie.toString();

        expect(string).toContain('expires=');
        expect(string).toContain('max-age=');
        expect(string).toContain('domain=example.com');
        expect(string).toContain('secure');
        expect(string).toContain('httponly');
    });

    it('renders a deletion cookie with a past expiry', () => {
        const string = new Cookie('session', 'abc').delete().toString();

        expect(string).toContain('session=delete');
        expect(string).toContain('max-age=-31536001');
    });

    it('omits the httponly flag when the cookie is not http-only', () => {
        expect(new Cookie('session', 'abc').withHttpOnly(false).toString()).not.toContain('httponly');
    });
});
