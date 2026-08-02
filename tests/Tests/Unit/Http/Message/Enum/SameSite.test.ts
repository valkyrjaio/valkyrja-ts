/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { SameSite } from '../../../../../../src/Valkyrja/Http/Message/Enum/SameSite.ts';

describe('SameSite', () => {
    it('exposes the same-site policy values', () => {
        expect(SameSite.NONE).toBe('none');
        expect(SameSite.LAX).toBe('lax');
        expect(SameSite.STRICT).toBe('strict');
    });
});
