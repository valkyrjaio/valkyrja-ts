/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CookieParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/CookieParamCollection.ts';

describe('CookieParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new CookieParamCollection().getAll()).toStrictEqual({});
        expect(new CookieParamCollection({ a: 1 } as never).get('a')).toBe(1);
    });
});
