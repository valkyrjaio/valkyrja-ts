/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { SetCookie } from '../../../../../../src/Valkyrja/Http/Message/Header/SetCookie.ts';
import { Cookie } from '../../../../../../src/Valkyrja/Http/Message/Header/Value/Cookie.ts';

describe('SetCookie', () => {
    it('uses the set-cookie header name and carries cookies', () => {
        const header = new SetCookie(new Cookie('session', 'abc'));

        expect(header.getName()).toBe(HeaderName.SET_COOKIE);
        expect(header.getValues()).toHaveLength(1);
    });
});
