/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
