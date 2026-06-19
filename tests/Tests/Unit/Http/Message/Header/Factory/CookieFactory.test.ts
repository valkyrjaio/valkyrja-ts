/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CookieFactory } from '../../../../../../../src/Valkyrja/Http/Message/Header/Factory/CookieFactory.ts';

describe('CookieFactory', () => {
    it('parses a cookie header into a name/value map', () => {
        const cookies = CookieFactory.parseCookieHeader('session=abc; theme=dark');

        expect(cookies).toStrictEqual({ session: 'abc', theme: 'dark' });
    });

    it('url-decodes cookie values', () => {
        const cookies = CookieFactory.parseCookieHeader('redirect=%2Fhome');

        expect(cookies['redirect']).toBe('/home');
    });

    it('converts a cookie map back into a header string', () => {
        expect(CookieFactory.convertCookieArrayToHeaderString({ session: 'abc', theme: 'dark' })).toBe(
            'session=abc; theme=dark',
        );
    });

    it('combines a key and value', () => {
        expect(CookieFactory.combineKeyAndValue('a', 'b')).toBe('a=b');
    });
});
