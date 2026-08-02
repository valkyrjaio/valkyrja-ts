/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod, allRequestMethods } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';

describe('RequestMethod', () => {
    it('exposes the method values', () => {
        expect(RequestMethod.GET).toBe('GET');
        expect(RequestMethod.POST).toBe('POST');
        expect(RequestMethod.ANY).toBe('ANY');
    });

    it('lists every concrete method, excluding ANY', () => {
        const methods = allRequestMethods();

        expect(methods).toContain(RequestMethod.GET);
        expect(methods).toContain(RequestMethod.PATCH);
        expect(methods).not.toContain(RequestMethod.ANY);
        expect(methods).toHaveLength(9);
    });
});
