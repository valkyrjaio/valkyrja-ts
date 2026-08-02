/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Char } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Constant/Char.ts';

describe('Char', () => {
    it('holds the unreserved characters', () => {
        expect(Char.UNRESERVED).toBe(String.raw`a-zA-Z0-9_\-\.~`);
    });

    it('holds the sub delimiters', () => {
        expect(Char.SUB_DELIMS).toBe(String.raw`!\$&'\(\)\*\+,;=`);
    });

    it('adds the colon to the user info set', () => {
        expect(Char.USER_INFO).toBe(Char.UNRESERVED + Char.SUB_DELIMS + ':');
    });

    it('adds nothing to the host set', () => {
        expect(Char.HOST).toBe(Char.UNRESERVED + Char.SUB_DELIMS);
    });

    it('adds the colon, at sign, and slash to the path set', () => {
        expect(Char.PATH).toBe(Char.UNRESERVED + Char.SUB_DELIMS + String.raw`:@\/`);
    });

    it('adds the question mark to the path set for the query set', () => {
        expect(Char.QUERY).toBe(Char.PATH + String.raw`\?`);
    });

    it('builds a valid character class from every component set', () => {
        for (const set of [Char.USER_INFO, Char.HOST, Char.PATH, Char.QUERY]) {
            expect(new RegExp('[^' + set + ']').test(' ')).toBe(true);
        }
    });
});
