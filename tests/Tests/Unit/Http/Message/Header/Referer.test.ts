/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { Referer } from '../../../../../../src/Valkyrja/Http/Message/Header/Referer.ts';

describe('Referer', () => {
    it('uses the referer header name and carries its value', () => {
        const header = new Referer('https://example.com');

        expect(header.getName()).toBe(HeaderName.REFERER);
        expect(header.getValues()).toStrictEqual(['https://example.com']);
    });
});
