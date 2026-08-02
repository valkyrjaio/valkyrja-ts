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
import { ContentType } from '../../../../../../src/Valkyrja/Http/Message/Header/ContentType.ts';

describe('ContentType', () => {
    it('uses the content-type header name and carries its value', () => {
        const header = new ContentType('text/html');

        expect(header.getName()).toBe(HeaderName.CONTENT_TYPE);
        expect(header.getValues()).toStrictEqual(['text/html']);
    });
});
