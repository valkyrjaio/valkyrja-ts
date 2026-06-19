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
import { HtmlResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/HtmlResponse.ts';

describe('HtmlResponse', () => {
    it('sets an html content type and writes the body', () => {
        const response = new HtmlResponse('<p>hi</p>');

        expect(response.getBody().getContents()).toBe('<p>hi</p>');
        expect(response.getHeaders().getHeaderLine(HeaderName.CONTENT_TYPE)).toContain('text/html');
    });
});
