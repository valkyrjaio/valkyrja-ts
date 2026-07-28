/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AttributeParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/AttributeParamCollection.ts';

describe('AttributeParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new AttributeParamCollection().getAll()).toStrictEqual({});
        expect(new AttributeParamCollection({ a: 1 }).get('a')).toBe(1);
    });
});
