/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ServerParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ServerParamCollection.ts';

describe('ServerParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new ServerParamCollection().getAll()).toStrictEqual({});
        expect(new ServerParamCollection({ a: 1 } as never).get('a')).toBe(1);
    });
});
