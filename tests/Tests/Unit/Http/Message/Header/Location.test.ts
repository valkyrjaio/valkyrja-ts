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
import { Location } from '../../../../../../src/Valkyrja/Http/Message/Header/Location.ts';

describe('Location', () => {
    it('uses the location header name and carries its value', () => {
        const header = new Location('/home');

        expect(header.getName()).toBe(HeaderName.LOCATION);
        expect(header.getValues()).toStrictEqual(['/home']);
    });
});
