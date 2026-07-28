/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ParsedJsonParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ParsedJsonParamCollection.ts';

describe('ParsedJsonParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new ParsedJsonParamCollection().getAll()).toStrictEqual({});
        expect(new ParsedJsonParamCollection({ a: 1 }).get('a')).toBe(1);
    });
});
