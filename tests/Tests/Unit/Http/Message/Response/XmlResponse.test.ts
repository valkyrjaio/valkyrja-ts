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
import { XmlResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/XmlResponse.ts';

describe('XmlResponse', () => {
    it('sets an xml content type and writes the body', () => {
        const response = new XmlResponse('<root/>');

        expect(response.getBody().getContents()).toBe('<root/>');
        expect(response.getHeaders().getHeaderLine(HeaderName.CONTENT_TYPE)).toContain('xml');
    });
});
