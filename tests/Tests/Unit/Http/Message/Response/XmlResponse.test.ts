/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
