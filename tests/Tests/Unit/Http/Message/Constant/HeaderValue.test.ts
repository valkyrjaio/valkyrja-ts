/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderValue } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderValue.ts';

describe('HeaderValue', () => {
    it('exposes the bearer authorization scheme', () => {
        expect(HeaderValue.BEARER).toBe('Bearer');
    });
});
